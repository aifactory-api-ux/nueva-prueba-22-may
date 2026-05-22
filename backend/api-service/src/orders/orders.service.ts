import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderItem } from './order.entity';
import { Product } from '../products/product.entity';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto, OrderResponseDto, OrderItemResponseDto } from './order.dto';
import { generateUUID, formatDateToISO, calculateTotalAmount } from '../../../shared/utils';
import { ORDER_STATUS, CURRENCY_CODES, DEFAULT_CURRENCY } from '../../../shared/types';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly cartService: CartService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(userId: string): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      where: { userId },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });

    return orders.map(order => this.toOrderResponse(order));
  }

  async findOne(id: string, userId: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id, userId },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.toOrderResponse(order);
  }

  async create(userId: string, dto: CreateOrderDto): Promise<OrderResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const productIds = dto.items.map(item => item.productId);
      const products = await this.productRepository
        .createQueryBuilder('product')
        .whereInIds(productIds)
        .getMany();

      const productMap = new Map(products.map(p => [p.id, p]));

      for (const item of dto.items) {
        const product = productMap.get(item.productId);
        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found`);
        }
        if (product.stock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for product ${product.name}`);
        }
      }

      const orderItems: { productId: string; quantity: number; price: number }[] = [];
      for (const item of dto.items) {
        const product = productMap.get(item.productId)!;
        product.stock -= item.quantity;
        await queryRunner.manager.save(product);
        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
      }

      const totalAmount = calculateTotalAmount(orderItems);

      const order = this.orderRepository.create({
        id: generateUUID(),
        userId,
        totalAmount,
        currency: DEFAULT_CURRENCY,
        status: ORDER_STATUS.PENDING,
        paymentIntentId: null,
      });
      await queryRunner.manager.save(order);

      for (const item of orderItems) {
        const orderItem = this.orderItemRepository.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });
        await queryRunner.manager.save(orderItem);
      }

      await this.cartService.clearCart(userId);

      await queryRunner.commitTransaction();

      const createdOrder = await this.orderRepository.findOne({
        where: { id: order.id },
        relations: ['items', 'items.product'],
      });

      return this.toOrderResponse(createdOrder!);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateOrderStatus(orderId: string, status: string, paymentIntentId?: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    order.status = status as typeof ORDER_STATUS.PENDING;
    if (paymentIntentId) {
      order.paymentIntentId = paymentIntentId;
    }

    return this.orderRepository.save(order);
  }

  private toOrderResponse(order: Order): OrderResponseDto {
    return {
      id: order.id,
      userId: order.userId,
      items: order.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        product: item.product ? {
          id: item.product.id,
          name: item.product.name,
          imageUrl: item.product.imageUrl,
        } : undefined,
      })),
      totalAmount: order.totalAmount,
      currency: order.currency,
      status: order.status,
      paymentIntentId: order.paymentIntentId,
      createdAt: formatDateToISO(order.createdAt),
      updatedAt: formatDateToISO(order.updatedAt),
    };
  }
}