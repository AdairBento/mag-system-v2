import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'LOGIN_FAILED'
  | 'REGISTER'
  | 'REFRESH_TOKEN'
  | 'PASSWORD_RESET'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_UNLOCKED';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registra login bem-sucedido
   */
  async logLogin(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.createLog('LOGIN', 'User', userId, {
      userId,
      ipAddress,
      userAgent,
      timestamp: new Date().toISOString(),
    });

    // Atualiza lastLoginAt do usuário
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }

  /**
   * Registra logout
   */
  async logLogout(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.createLog('LOGOUT', 'User', userId, {
      userId,
      ipAddress,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Registra tentativa de login falhada
   */
  async logLoginFailed(
    email: string,
    reason: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.createLog('LOGIN_FAILED', 'User', null, {
      email,
      reason,
      ipAddress,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Registra novo registro de usuário
   */
  async logRegister(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.createLog('REGISTER', 'User', userId, {
      userId,
      ipAddress,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Registra refresh de token
   */
  async logRefreshToken(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.createLog('REFRESH_TOKEN', 'User', userId, {
      userId,
      ipAddress,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Registra bloqueio de conta
   */
  async logAccountLocked(
    userId: string,
    reason: string,
    lockDurationMinutes: number,
  ): Promise<void> {
    await this.createLog('ACCOUNT_LOCKED', 'User', userId, {
      userId,
      reason,
      lockDurationMinutes,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Método genérico para criar log
   */
  private async createLog(
    action: AuditAction,
    resource: string,
    resourceId: string | null,
    metadata: Record<string, any>,
  ): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        userId: metadata.userId || null,
        action,
        resource,
        resourceId,
        metadata,
        ipAddress: metadata.ipAddress || null,
        userAgent: metadata.userAgent || null,
      },
    });
  }
}
