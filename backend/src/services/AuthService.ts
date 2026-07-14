import { UserRepository } from '../repositories/UserRepository';
import { hashPassword, signToken } from '../../lib/jwt';
import { BadRequestException } from '../exceptions/BadRequestException';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';
import { UserEntity } from '../entities/UserEntity';

export class AuthService {
  /**
   * Register a new user profile
   */
  static async register(data: { name: string; email: string; password?: string; role?: string; avatar?: string }) {
    const { name, email, password, role, avatar } = data;

    if (!name || !email || !password) {
      throw new BadRequestException('Name, email, and password are required');
    }

    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const id = `U-${Math.floor(1000 + Math.random() * 9000)}`;
    const password_hash = hashPassword(password);
    const userRole = (role === 'admin' ? 'admin' : 'user') as 'admin' | 'user';
    const userAvatar = avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;

    const newEntity: Omit<UserEntity, 'created_at'> = {
      id,
      name,
      email,
      password_hash,
      role: userRole,
      avatar: userAvatar
    };

    await UserRepository.create(newEntity);

    return {
      id,
      name,
      email,
      role: userRole,
      avatar: userAvatar
    };
  }

  /**
   * Authenticate credentials and return signed access token
   */
  static async login(data: { email?: string; password?: string }) {
    const { email, password } = data;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passHash = hashPassword(password);
    if (user.password_hash !== passHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate token
    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    };

    const accessToken = signToken(tokenPayload);

    return {
      accessToken,
      user: tokenPayload
    };
  }
}
