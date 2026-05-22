import { IsString, IsNumber, IsPositive, Min, IsUUID } from 'class-validator';

export class AddCartItemDto {
  @IsString()
  @IsUUID()
  productId: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}

export class UpdateCartItemDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}

export class CartItemResponseDto {
  productId: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
    currency: string;
    imageUrl: string;
    stock: number;
  };
}

export class CartResponseDto {
  id: string;
  userId: string;
  items: CartItemResponseDto[];
  updatedAt: string;
}