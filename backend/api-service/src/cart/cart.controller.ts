import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CartService } from './cart.service';
import { AddCartItemDto, UpdateCartItemDto, CartResponseDto } from './cart.dto';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Request() req: { user: { userId: string } }): Promise<CartResponseDto> {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  async addCartItem(
    @Request() req: { user: { userId: string } },
    @Body() dto: AddCartItemDto,
  ): Promise<CartResponseDto> {
    return this.cartService.addCartItem(req.user.userId, dto);
  }

  @Put('items/:productId')
  async updateCartItem(
    @Request() req: { user: { userId: string } },
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    return this.cartService.updateCartItem(req.user.userId, productId, dto);
  }

  @Delete('items/:productId')
  async removeCartItem(
    @Request() req: { user: { userId: string } },
    @Param('productId') productId: string,
  ): Promise<CartResponseDto> {
    return this.cartService.removeCartItem(req.user.userId, productId);
  }
}