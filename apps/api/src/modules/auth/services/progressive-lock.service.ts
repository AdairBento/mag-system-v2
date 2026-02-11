import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { AuditService } from './audit.service';

/**
 * Serviço de bloqueio progressivo para prevenir brute-force
 * 
 * Lógica:
 * - 1-2 tentativas: sem bloqueio
 * - 3 tentativas: 5 minutos de bloqueio
 * - 4 tentativas: 15 minutos de bloqueio
 * - 5 tentativas: 1 hora de bloqueio
 * - 6+ tentativas: 24 horas de bloqueio
 */
@Injectable()
export class ProgressiveLockService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Verifica se o usuário está bloqueado
   * @param userId - ID do usuário
   * @returns true se bloqueado, false caso contrário
   */
  async isLocked(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { lockedUntil: true },
    });

    if (!user || !user.lockedUntil) {
      return false;
    }

    // Se o bloqueio já passou, desbloquear automaticamente
    if (user.lockedUntil < new Date()) {
      await this.unlock(userId);
      return false;
    }

    return true;
  }

  /**
   * Registra uma tentativa de login falha
   * @param userId - ID do usuário
   * @param ipAddress - IP da tentativa
   * @returns Tempo de bloqueio em minutos (0 se não bloqueado)
   */
  async recordFailedAttempt(
    userId: string,
    ipAddress?: string,
  ): Promise<{ locked: boolean; lockMinutes: number; attempts: number }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { failedLoginAttempts: true },
    });

    if (!user) {
      return { locked: false, lockMinutes: 0, attempts: 0 };
    }

    const attempts = user.failedLoginAttempts + 1;

    // Calcular tempo de bloqueio baseado nas tentativas
    const lockMinutes = this.calculateLockMinutes(attempts);

    if (lockMinutes > 0) {
      // Aplicar bloqueio
      const lockUntil = new Date();
      lockUntil.setMinutes(lockUntil.getMinutes() + lockMinutes);

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          failedLoginAttempts: attempts,
          lockedUntil: lockUntil,
        },
      });

      // Log de bloqueio
      await this.auditService.logAccountLocked(
        userId,
        attempts,
        lockUntil,
        ipAddress,
      );

      return { locked: true, lockMinutes, attempts };
    } else {
      // Apenas incrementar tentativas
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          failedLoginAttempts: attempts,
        },
      });

      return { locked: false, lockMinutes: 0, attempts };
    }
  }

  /**
   * Reseta tentativas falhas após login bem-sucedido
   * @param userId - ID do usuário
   */
  async resetFailedAttempts(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  /**
   * Desbloqueia um usuário manualmente
   * @param userId - ID do usuário
   */
  async unlock(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  /**
   * Calcula o tempo de bloqueio baseado no número de tentativas
   * @param attempts - Número de tentativas falhas
   * @returns Tempo de bloqueio em minutos (0 se não deve bloquear)
   */
  private calculateLockMinutes(attempts: number): number {
    if (attempts < 3) return 0; // 1-2 tentativas: sem bloqueio
    if (attempts === 3) return 5; // 3 tentativas: 5 minutos
    if (attempts === 4) return 15; // 4 tentativas: 15 minutos
    if (attempts === 5) return 60; // 5 tentativas: 1 hora
    return 1440; // 6+ tentativas: 24 horas
  }

  /**
   * Retorna tempo restante de bloqueio
   * @param userId - ID do usuário
   * @returns Tempo restante em minutos (0 se não bloqueado)
   */
  async getRemainingLockTime(userId: string): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { lockedUntil: true },
    });

    if (!user || !user.lockedUntil) {
      return 0;
    }

    const now = new Date();
    if (user.lockedUntil < now) {
      return 0;
    }

    const diffMs = user.lockedUntil.getTime() - now.getTime();
    return Math.ceil(diffMs / 1000 / 60); // Converter para minutos
  }
}
