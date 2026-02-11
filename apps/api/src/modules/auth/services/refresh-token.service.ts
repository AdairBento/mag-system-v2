import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/database/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Gera um novo refresh token para o usuário
   * @param userId - ID do usuário
   * @param ipAddress - IP da requisição (opcional)
   * @param userAgent - User agent do navegador (opcional)
   * @returns Refresh token gerado (string hexadecimal de 128 chars)
   */
  async generateRefreshToken(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<string> {
    // Gerar token único criptograficamente seguro
    const refreshToken = crypto.randomBytes(64).toString('hex');

    // Calcular expiração (30 dias)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Salvar sessão no banco
    await this.prisma.session.create({
      data: {
        userId,
        refreshToken,
        ipAddress,
        userAgent,
        expiresAt,
      },
    });

    return refreshToken;
  }

  /**
   * Valida um refresh token
   * @param token - Refresh token a ser validado
   * @returns userId se válido, null se inválido/expirado
   */
  async validateRefreshToken(
    token: string,
  ): Promise<{ userId: string } | null> {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken: token },
      include: { user: { select: { id: true, status: true } } },
    });

    if (!session) {
      return null;
    }

    // Verificar expiração
    if (session.expiresAt < new Date()) {
      // Token expirado, remover da base
      await this.prisma.session.delete({ where: { id: session.id } });
      return null;
    }

    // Verificar se usuário está ativo
    if (session.user.status !== 'ACTIVE') {
      return null;
    }

    return { userId: session.user.id };
  }

  /**
   * Revoga um refresh token específico
   * @param token - Token a ser revogado
   */
  async revokeRefreshToken(token: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { refreshToken: token },
    });
  }

  /**
   * Revoga todas as sessões de um usuário (logout global)
   * @param userId - ID do usuário
   */
  async revokeAllUserSessions(userId: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { userId },
    });
  }

  /**
   * Remove sessões expiradas do banco (cleanup job)
   */
  async cleanupExpiredSessions(): Promise<number> {
    const result = await this.prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }

  /**
   * Lista sessões ativas de um usuário
   * @param userId - ID do usuário
   */
  async getUserSessions(userId: string) {
    return this.prisma.session.findMany({
      where: {
        userId,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
