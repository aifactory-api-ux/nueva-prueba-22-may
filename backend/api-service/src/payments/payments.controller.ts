import { Controller, Post, Body, Headers, Req, HttpCode, HttpStatus, UnauthorizedException, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressRequest } from 'express';
import { PaymentsService } from './payments.service';
import { CreatePaymentSessionDto, PaymentSessionResponseDto, WebhookResponseDto } from './payments.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-session')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async createSession(
    @Body() dto: CreatePaymentSessionDto,
    @Request() req: { user: { userId: string } },
  ): Promise<PaymentSessionResponseDto> {
    return this.paymentsService.createSession(req.user.userId, dto);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: ExpressRequest,
    @Headers('stripe-signature') signature: string,
  ): Promise<WebhookResponseDto> {
    if (!signature) {
      throw new UnauthorizedException('Missing Stripe signature');
    }
    const rawBody = (req as any).rawBody;
    if (!rawBody) {
      throw new Error('Raw body not available. Configure express to parse raw body.');
    }
    return this.paymentsService.handleWebhook(Buffer.from(rawBody), signature);
  }
}
