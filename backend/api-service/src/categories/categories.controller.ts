import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto } from './category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoriesService.findAll();
    return categories.map(category => this.categoriesService.toResponse(category));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CategoryResponseDto> {
    const category = await this.categoriesService.findOne(id);
    return this.categoriesService.toResponse(category);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() dto: CreateCategoryDto, @Request() req: { user: { role: string } }): Promise<CategoryResponseDto> {
    if (req.user.role !== 'admin') {
      throw new Error('Forbidden');
    }
    const category = await this.categoriesService.create(dto);
    return this.categoriesService.toResponse(category);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto, @Request() req: { user: { role: string } }): Promise<CategoryResponseDto> {
    if (req.user.role !== 'admin') {
      throw new Error('Forbidden');
    }
    const category = await this.categoriesService.update(id, dto);
    return this.categoriesService.toResponse(category);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string, @Request() req: { user: { role: string } }): Promise<{ success: boolean }> {
    if (req.user.role !== 'admin') {
      throw new Error('Forbidden');
    }
    await this.categoriesService.delete(id);
    return { success: true };
  }
}