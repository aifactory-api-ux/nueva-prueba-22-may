import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from './product.dto';
import { generateUUID, formatDateToISO } from '../../../shared/utils';
import { CURRENCY_CODES } from '../shared/constants';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(categoryId?: string): Promise<Product[]> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (categoryId) {
      queryBuilder.where('product.categoryId = :categoryId', { categoryId });
    }

    queryBuilder.orderBy('product.createdAt', 'DESC');

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create({
      id: generateUUID(),
      name: dto.name,
      description: dto.description,
      price: dto.price,
      originalPrice: dto.originalPrice ?? null,
      currency: dto.currency || CURRENCY_CODES.USD,
      imageUrl: dto.imageUrl,
      stock: dto.stock,
      categoryId: dto.categoryId,
    });

    return this.productRepository.save(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.price !== undefined) product.price = dto.price;
    if (dto.originalPrice !== undefined) product.originalPrice = dto.originalPrice;
    if (dto.currency !== undefined) product.currency = dto.currency;
    if (dto.imageUrl !== undefined) product.imageUrl = dto.imageUrl;
    if (dto.stock !== undefined) product.stock = dto.stock;
    if (dto.categoryId !== undefined) product.categoryId = dto.categoryId;

    return this.productRepository.save(product);
  }

  async delete(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  toResponse(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice ?? null,
      currency: product.currency,
      imageUrl: product.imageUrl,
      stock: product.stock,
      categoryId: product.categoryId,
      createdAt: formatDateToISO(product.createdAt),
      updatedAt: formatDateToISO(product.updatedAt),
    };
  }
}
