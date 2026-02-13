import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/database/prisma.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { AuditService } from './services/audit.service';
import { ProgressiveLockService } from './services/progressive-lock.service';
import { LoginDto, RegisterDto } from './dto';
import * as bcrypt from 'bcryptjs';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly auditService: AuditService,
    private readonly lockService: ProgressiveLockService
  ) {}

  /**
   * Registra novo usuário
   */
  async register(dto: RegisterDto, ipAddress?: string, userAgent?: string): Promise<AuthTokens> {
    // Verifica se email já existe
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new UnauthorizedException('Email já cadastrado');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Cria usuário com role padrão OPERATOR se não especificado
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword,
        name: dto.name,
        role: dto.role ?? 'OPERATOR',
      },
    });

    // Gera tokens
    const tokens = await this.generateTokens(user.id, user.role);

    // Armazena refresh token
    await this.refreshTokenService.generateRefreshToken(user.id, ipAddress, userAgent);

    // Auditoria
    await this.auditService.logRegister(user.id, ipAddress, userAgent);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  /**
   * Login com email e senha
   */
  async login(dto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthTokens> {
    // Busca usuário
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Verifica existência
    if (!user) {
      await this.auditService.logLoginFailed(
        dto.email,
        'Usuário não encontrado',
        ipAddress,
        userAgent
      );
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verifica bloqueio
    await this.lockService.checkLockBeforeLogin(user.id);

    // Verifica senha
    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordValid) {
      // Registra falha
      const lockResult = await this.lockService.recordFailedAttempt(user.id, ipAddress);

      await this.auditService.logLoginFailed(dto.email, 'Senha inválida', ipAddress, userAgent);

      if (lockResult.locked) {
        throw new UnauthorizedException(
          `Conta bloqueada por ${lockResult.lockMinutes} minuto(s) após ${lockResult.attempts} tentativas falhadas`
        );
      }

      throw new UnauthorizedException(
        `Credenciais inválidas. Tentativa ${lockResult.attempts}/${5}`
      );
    }

    // Verifica status
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Conta inativa');
    }

    // Reseta contador de falhas
    await this.lockService.resetFailedAttempts(user.id);

    // Gera tokens
    const tokens = await this.generateTokens(user.id, user.role);

    // Armazena refresh token
    await this.refreshTokenService.generateRefreshToken(user.id, ipAddress, userAgent);

    // Auditoria
    await this.auditService.logLogin(user.id, ipAddress, userAgent);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  /**
   * Logout - revoga refresh token
   */
  async logout(
    userId: string,
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.refreshTokenService.revokeRefreshToken(refreshToken);
    await this.auditService.logLogout(userId, ipAddress, userAgent);
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ accessToken: string }> {
    // Valida refresh token
    const payload = await this.refreshTokenService.validateRefreshToken(refreshToken);

    if (!payload) {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }

    // Busca usuário
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Usuário inválido ou inativo');
    }

    // Gera novo access token
    const accessToken = await this.generateAccessToken(user.id, user.role);

    // Auditoria
    await this.auditService.logRefreshToken(user.id, ipAddress, userAgent);

    return { accessToken };
  }

  /**
   * Gera access e refresh tokens
   */
  private async generateTokens(
    userId: string,
    role: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, role };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '15m'),
    });

    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      {
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '30d'),
      }
    );

    return { accessToken, refreshToken };
  }

  /**
   * Gera apenas access token
   */
  private async generateAccessToken(userId: string, role: string): Promise<string> {
    const payload = { sub: userId, role };

    return this.jwtService.sign(payload, {
      expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '15m'),
    });
  }

  /**
   * Valida access token
   */
  async validateUser(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      return null;
    }

    return user;
  }
}
