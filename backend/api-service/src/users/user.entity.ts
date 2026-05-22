import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserRole } from '../../../shared/types';

@Entity('users')
export class User {
  @PrimaryColumn('varchar', { length: 32 })
  id: string;

  @Column('varchar', { length: 255, unique: true })
  email: string;

  @Column('varchar', { length: 255, name: 'password_hash' })
  passwordHash: string;

  @Column('varchar', { length: 255, name: 'full_name' })
  fullName: string;

  @Column({
    type: 'enum',
    enum: ['customer', 'admin'],
    default: 'customer',
  })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}