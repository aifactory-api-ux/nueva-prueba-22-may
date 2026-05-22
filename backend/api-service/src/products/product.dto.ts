import { IsString, IsNumber, IsOptional, MinLength, MaxLength, IsUrl, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  originalPrice?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsUrl()
  imageUrl: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @IsString()
  @MinLength(1)
  categoryId: string;
}

export class UpdateProductDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  price?: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  originalPrice?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  stock?: number;

  @IsString()
  @MinLength(1)
  @IsOptional()
  categoryId?: string;
}

export class ProductResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  currency: string;
  imageUrl: string;
  stock: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export class ProductListQueryDto {
  @IsString()
  @IsOptional()
  categoryId?: string;
}
