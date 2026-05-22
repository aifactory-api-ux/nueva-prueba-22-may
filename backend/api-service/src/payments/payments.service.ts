import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { OrdersService } from '../orders/orders.service';
import { STRIPE_CONFIG, ORDER_STATUS } from '../../shared/constants';
import { CreatePaymentSessionDto, PaymentSessionResponseDto } from './payments.dto';
import { validateUUID } from '../../../shared/utils';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private readonly ordersService: OrdersService) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: STRIPE_CONFIG.API_VERSION as Stripe.LatestApiVersion,
    });
  }

  async createSession(userId: string, dto: CreatePaymentSessionDto): Promise<PaymentSessionResponseDto> {
    validateUUID(dto.orderId, 'orderId');

    const order = await this.ordersService.findOne(dto.orderId, userId);

    if (order.status !== ORDER_STATUS.PENDING) {
      throw new BadRequestException(`Order ${dto.orderId} is not in pending status`);
    }

    const successUrl = process.env.STRIPE_SUCCESS_URL || 'http://localhost:24000/success';
    const cancelUrl = process.env.STRIPE_CANCEL_URL || 'http://localhost:24000/cancel';

    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: order.items.map(item => ({
          price_data: {
            currency: order.currency.toLowerCase(),
            product_data: {
              name: item.product?.name || `Product ${item.productId}`,
            },
            unit_amount: item.price,
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${cancelUrl}?order_id=${dto.orderId}`,
        metadata: {
          orderId: dto.orderId,
          userId,
        },
      });

      await this.ordersService.updateOrderStatus(dto.orderId, order.status, session.payment_intent as string);

      return {
        sessionId: session.id,
        url: session.url!,
      };
    } catch (error) {
      this.logger.error(`Failed to create Stripe session: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create payment session');
    }
  }

  async handleWebhook(payload: Buffer, signature: string): Promise<{ received: boolean }> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET environment variable is required');
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new BadRequestException('Invalid webhook signature');
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const orderId = session.metadata?.orderId;
          if (orderId) {
            await this.ordersService.updateOrderStatus(orderId, ORDER_STATUS.PAID, session.payment_intent as string);
            this.logger.log(`Order ${orderId} marked as paid`);
          }
          break;
        }
        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          this.logger.warn(`Payment failed: ${paymentIntent.id}`);
          break;
        }
        case 'payment_intent.canceled': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          this.logger.log(`Payment canceled: ${paymentIntent.id}`);
          break;
        }
        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      this.logger.error(`Failed to process webhook: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to process webhook');
    }

    return { received: true };
  }

  async getPaymentStatus(orderId: string): Promise<{ status: string; paymentIntentId: string | null }> {
    validateUUID(orderId, 'orderId');

    const order = await this.ordersService.findOne(orderId, '');
    return {
      status: order.status,
      paymentIntentId: order.paymentIntentId,
    };
  }
}