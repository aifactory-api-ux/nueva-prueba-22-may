import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { OrderStatus } from '../shared/types';

@Entity('orders')
export class Order {
  @PrimaryColumn('varchar', { length: 32 })
  id: string;

  @Column('varchar', { length: 32, name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('int', { name: 'total_amount' })
  totalAmount: number;

  @Column('varchar', { length: 3, default: 'USD' })
  currency: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'paid', 'cancelled', 'shipped', 'delivered'],
    default: 'pending',
  })
  status: OrderStatus;

  @Column('varchar', { length: 255, name: 'payment_intent_id', nullable: true })
  paymentIntentId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial: Partial<Order>) {
    Object.assign(this, partial);
  }
}

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 32, name: 'order_id' })
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column('varchar', { length: 32, name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column('int')
  quantity: number;

  @Column('int')
  price: number;

  constructor(partial: Partial<OrderItem>) {
    Object.assign(this, partial);
  }
}