import { IsString, IsNumber, IsPositive, Min, IsUUID, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsString()
  @IsUUID()
  productId: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

export class OrderItemResponseDto {
  productId: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    imageUrl: string;
  };
}

export class OrderResponseDto {
  id: string;
  userId: string;
  items: OrderItemResponseDto[];
  totalAmount: number;
  currency: string;
  status: string;
  paymentIntentId: string | null;
  createdAt: string;
  updatedAt: string;
}