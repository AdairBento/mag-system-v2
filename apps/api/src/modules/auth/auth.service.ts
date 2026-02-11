import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/database/prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto, RegisterDto, AuthResponseDto } from '@mag-system/core';
import { RefreshTokenService } from './services/refresh-token.service';
import { AuditService } from './services/audit.service';
import { ProgressiveLockService } from './services/progressive-lock.service';

type UserRole = 'ADMIN' | 'MANAGER' | 'OPERATOR';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
    private auditService: AuditService,
    private progressiveLockService: ProgressiveLockService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
        role: registerDto.role || 'OPERATOR',
      },
    });

    return this.generateTokens(user);
  }

  async login(
    loginDto: LoginDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      // Log failed login attempt (user not found)
      await this.auditService.logLoginFailed(
        loginDto.email,
        'User not found',
        ipAddress,
        userAgent,
      );
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Check if user is locked (progressive lock)
    const isLocked = await this.progressiveLockService.isLocked(user.id);
    if (isLocked) {
      const remainingMinutes = await this.progressiveLockService.getRemainingLockTime(user.id);
      throw new UnauthorizedException(
        `Conta bloqueada. Tente novamente em ${remainingMinutes} minutos.`,
      );
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      await this.auditService.logLoginFailed(
        loginDto.email,
        `User status: ${user.status}`,
        ipAddress,
        userAgent,
      );
      throw new UnauthorizedException('Conta inativa ou suspensa');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      // Record failed attempt and check if should lock
      const lockResult = await this.progressiveLockService.recordFailedAttempt(
        user.id,
        ipAddress,
      );

      // Log failed login attempt
      await this.auditService.logLoginFailed(
        loginDto.email,
        'Invalid password',
        ipAddress,
        userAgent,
      );

      if (lockResult.locked) {
        throw new UnauthorizedException(
          `Credenciais inválidas. Conta bloqueada por ${lockResult.lockMinutes} minutos após ${lockResult.attempts} tentativas falhas.`,
        );
      } else {
        throw new UnauthorizedException(
          `Credenciais inválidas. Tentativa ${lockResult.attempts} de 3.`,
        );
      }
    }

    // ✅ LOGIN SUCCESSFUL

    // Reset failed attempts
    await this.progressiveLockService.resetFailedAttempts(user.id);

    // Update lastLoginAt
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens (access + refresh)
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.refreshTokenService.generateRefreshToken(
      user.id,
      ipAddress,
      userAgent,
    );

    // Audit log
    await this.auditService.logLogin(user.id, ipAddress, userAgent);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as UserRole,
      },
    };
  }

  async logout(
    userId: string,
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    // Revoke refresh token
    await this.refreshTokenService.revokeRefreshToken(refreshToken);

    // Audit log
    await this.auditService.logLogout(userId, ipAddress, userAgent);
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    const result = await this.refreshTokenService.validateRefreshToken(refreshToken);

    if (!result) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: result.userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const accessToken = this.generateAccessToken(user);

    return { accessToken };
  }

  /**
   * Generates JWT access token (short-lived, 15 min)
   */
  private generateAccessToken(user: {
    id: string;
    email: string;
    role: string;
  }): string {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  /**
   * @deprecated Use login() instead - returns separate accessToken and refreshToken
   */
  private generateTokens(user: {
    id: string;
    email: string;
    name: string;
    role: string;
  }): AuthResponseDto {
    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '30d' }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as UserRole,
      },
    };
  }
}
