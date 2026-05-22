import { IsString, IsOptional, IsEnum, IsEmail, MinLength } from 'class-validator';
import { UserRole } from '../../../shared/types';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  fullName: string;

  @IsOptional()
  @IsEnum(['customer', 'admin'])
  role?: UserRole;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEnum(['customer', 'admin'])
  role?: UserRole;
}

export class UserResponseDto {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}