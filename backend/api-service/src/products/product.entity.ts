import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity('products')
export class Product {
  @PrimaryColumn('varchar', { length: 32 })
  id: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('text')
  description: string;

  @Column('int')
  price: number;

  @Column('int', { nullable: true, name: 'original_price' })
  originalPrice: number | null;

  @Column('varchar', { length: 3, default: 'USD' })
  currency: string;

  @Column('varchar', { length: 500, name: 'image_url' })
  imageUrl: string;

  @Column('int', { default: 0 })
  stock: number;

  @Column('varchar', { length: 32, name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}
