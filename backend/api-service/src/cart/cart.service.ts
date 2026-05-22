import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartItem } from './cart.entity';
import { Product } from '../products/product.entity';
import { AddCartItemDto, UpdateCartItemDto, CartResponseDto, CartItemResponseDto } from './cart.dto';
import { generateUUID, formatDateToISO } from '../shared/utils';
import { REDIS_CONFIG } from '../shared/constants';
import Redis from 'ioredis';

@Injectable()
export class CartService {
  private redisClient: Redis | null = null;

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
    this.initRedisClient();
  }

  private async initRedisClient(): Promise<void> {
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = parseInt(process.env.REDIS_PORT || '26379', 10);
    const redisPassword = process.env.REDIS_PASSWORD || undefined;

    this.redisClient = new Redis({
      host: redisHost,
      port: redisPort,
      password: redisPassword,
      db: 0,
      connectTimeout: 10000,
      retryDelayOnFailover: 1000,
      maxRetriesPerRequest: 3,
    });

    this.redisClient.on('error', (err) => {
      console.error('Redis client error:', err);
    });
  }

  private getCartCacheKey(userId: string): string {
    return `${REDIS_CONFIG.KEY_PREFIX}cart:${userId}`;
  }

  async getCart(userId: string): Promise<CartResponseDto> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({
        id: generateUUID(),
        userId,
        items: [],
      });
      await this.cartRepository.save(cart);
    }

    return this.toCartResponse(cart);
  }

  async addCartItem(userId: string, dto: AddCartItemDto): Promise<CartResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${dto.productId} not found`);
    }

    if (product.stock < dto.quantity) {
      throw new BadRequestException(`Insufficient stock for product ${product.name}`);
    }

    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({
        id: generateUUID(),
        userId,
        items: [],
      });
      await this.cartRepository.save(cart);
    }

    const existingItem = cart.items.find(item => item.productId === dto.productId);
    if (existingItem) {
      const newQuantity = existingItem.quantity + dto.quantity;
      if (product.stock < newQuantity) {
        throw new BadRequestException(`Insufficient stock for product ${product.name}`);
      }
      existingItem.quantity = newQuantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      const cartItem = this.cartItemRepository.create({
        cartId: cart.id,
        productId: dto.productId,
        quantity: dto.quantity,
      });
      await this.cartItemRepository.save(cartItem);
      cart.items.push(cartItem);
    }

    await this.invalidateCartCache(userId);

    return this.getCart(userId);
  }

  async updateCartItem(userId: string, productId: string, dto: UpdateCartItemDto): Promise<CartResponseDto> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = cart.items.find(item => item.productId === productId);
    if (!cartItem) {
      throw new NotFoundException(`Item with product ID ${productId} not found in cart`);
    }

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (product.stock < dto.quantity) {
      throw new BadRequestException(`Insufficient stock for product ${product.name}`);
    }

    cartItem.quantity = dto.quantity;
    await this.cartItemRepository.save(cartItem);

    await this.invalidateCartCache(userId);

    return this.getCart(userId);
  }

  async removeCartItem(userId: string, productId: string): Promise<CartResponseDto> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = cart.items.find(item => item.productId === productId);
    if (!cartItem) {
      throw new NotFoundException(`Item with product ID ${productId} not found in cart`);
    }

    await this.cartItemRepository.remove(cartItem);

    await this.invalidateCartCache(userId);

    return this.getCart(userId);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items'],
    });

    if (cart && cart.items.length > 0) {
      await this.cartItemRepository.remove(cart.items);
    }

    await this.invalidateCartCache(userId);
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });

    return cart?.items || [];
  }

  private async invalidateCartCache(userId: string): Promise<void> {
    if (this.redisClient) {
      try {
        const cacheKey = this.getCartCacheKey(userId);
        await this.redisClient.del(cacheKey);
      } catch (error) {
        console.error('Failed to invalidate cart cache:', error);
      }
    }
  }

  private toCartResponse(cart: Cart): CartResponseDto {
    return {
      id: cart.id,
      userId: cart.userId,
      items: cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        product: item.product ? {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          currency: item.product.currency,
          imageUrl: item.product.imageUrl,
          stock: item.product.stock,
        } : undefined,
      })),
      updatedAt: formatDateToISO(cart.updatedAt),
    };
  }
}