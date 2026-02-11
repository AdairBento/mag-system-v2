import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { AuditService } from './audit.service';

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;

@Injectable()
export class ProgressiveLockService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Verifica se a conta está bloqueada
   */
  async isLocked(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { lockedUntil: true },
    });

    if (!user?.lockedUntil) {
      return false;
    }

    return user.lockedUntil > new Date();
  }

  /**
   * Retorna tempo restante de bloqueio em minutos
   */
  async getRemainingLockTime(userId: string): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { lockedUntil: true },
    });

    if (!user?.lockedUntil || user.lockedUntil <= new Date()) {
      return 0;
    }

    const diffMs = user.lockedUntil.getTime() - Date.now();
    return Math.ceil(diffMs / 60000); // minutos
  }

  /**
   * Registra tentativa falhada e bloqueia se necessário
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

    if (attempts >= MAX_ATTEMPTS) {
      const lockedUntil = new Date();
      lockedUntil.setMinutes(lockedUntil.getMinutes() + LOCK_DURATION_MINUTES);

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          failedLoginAttempts: attempts,
          lockedUntil,
        },
      });

      await this.auditService.logAccountLocked(
        userId,
        `${MAX_ATTEMPTS} tentativas de login falhadas`,
        LOCK_DURATION_MINUTES,
      );

      return {
        locked: true,
        lockMinutes: LOCK_DURATION_MINUTES,
        attempts,
      };
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { failedLoginAttempts: attempts },
    });

    return {
      locked: false,
      lockMinutes: 0,
      attempts,
    };
  }

  /**
   * Reseta tentativas falhadas (após login bem-sucedido)
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
   * Verifica bloqueio antes de login
   * Lança exceção se bloqueado
   */
  async checkLockBeforeLogin(userId: string): Promise<void> {
    const locked = await this.isLocked(userId);

    if (locked) {
      const remainingMinutes = await this.getRemainingLockTime(userId);

      throw new UnauthorizedException(
        `Conta bloqueada. Tente novamente em ${remainingMinutes} minuto(s).`,
      );
    }
  }
}
