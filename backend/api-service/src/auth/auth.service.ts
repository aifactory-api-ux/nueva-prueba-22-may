import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { RegisterDto, LoginDto } from './auth.dto';
import { hashPassword, comparePassword, generateUUID, isValidEmail } from '../shared/utils';
import { ROLES } from '../shared/types';
import * as jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { JWT_CONFIG } from '../shared/constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(dto: RegisterDto): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    if (!isValidEmail(dto.email)) {
      throw new BadRequestException('Invalid email format');
    }

    if (dto.password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = hashPassword(dto.password);
    const user = this.userRepository.create({
      id: generateUUID(),
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      role: ROLES.CUSTOMER,
    });

    const saved = await this.userRepository.save(user);
    return this.generateTokens(saved);
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = comparePassword(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production') as { userId: string };

      const user = await this.userRepository.findOne({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  generateTokens(user: User): { accessToken: string; refreshToken: string; expiresIn: number } {
    const accessOptions: SignOptions = { expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRES_IN, algorithm: JWT_CONFIG.ALGORITHM };
    const refreshOptions: SignOptions = { expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRES_IN, algorithm: JWT_CONFIG.ALGORITHM };

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default-secret-change-in-production',
      accessOptions,
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production',
      refreshOptions,
    );

    const expiresIn = this.parseExpiresIn(JWT_CONFIG.ACCESS_TOKEN_EXPIRES_IN);

    return { accessToken, refreshToken, expiresIn };
  }

  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 3600;
    }
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 3600;
      case 'd': return value * 86400;
      default: return 3600;
    }
  }
}
