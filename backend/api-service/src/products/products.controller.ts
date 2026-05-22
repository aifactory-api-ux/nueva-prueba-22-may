import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductResponseDto, ProductListQueryDto } from './product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query() query: ProductListQueryDto): Promise<ProductResponseDto[]> {
    const products = await this.productsService.findAll(query.categoryId);
    return products.map(product => this.productsService.toResponse(product));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    const product = await this.productsService.findOne(id);
    return this.productsService.toResponse(product);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() dto: CreateProductDto, @Request() req: { user: { role: string } }): Promise<ProductResponseDto> {
    if (req.user.role !== 'admin') {
      throw new Error('Forbidden');
    }
    const product = await this.productsService.create(dto);
    return this.productsService.toResponse(product);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto, @Request() req: { user: { role: string } }): Promise<ProductResponseDto> {
    if (req.user.role !== 'admin') {
      throw new Error('Forbidden');
    }
    const product = await this.productsService.update(id, dto);
    return this.productsService.toResponse(product);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string, @Request() req: { user: { role: string } }): Promise<{ success: boolean }> {
    if (req.user.role !== 'admin') {
      throw new Error('Forbidden');
    }
    await this.productsService.delete(id);
    return { success: true };
  }
}