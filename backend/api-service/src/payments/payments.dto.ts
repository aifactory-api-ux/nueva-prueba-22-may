import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePaymentSessionDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;
}

export class PaymentSessionResponseDto {
  sessionId: string;
  url: string;
}

export class StripeWebhookDto {
  @IsString()
  @IsNotEmpty()
  eventType: string;

  @IsString()
  @IsOptional()
  paymentIntentId?: string;

  @IsString()
  @IsOptional()
  orderId?: string;

  @IsOptional()
  metadata?: Record<string, string>;
}

export class WebhookResponseDto {
  received: boolean;
}