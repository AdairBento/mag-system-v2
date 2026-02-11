import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

interface AuditLogData {
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

interface AuditLogResult {
  data: any[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um log de auditoria genérico
   * @param data - Dados do log
   */
  async log(data: AuditLogData): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId,
        metadata: data.metadata,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }

  // ============================================
  // LOGS DE AUTENTICAÇÃO
  // ============================================

  /**
   * Log de login bem-sucedido
   */
  async logLogin(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.log({
      userId,
      action: 'LOGIN',
      resource: 'User',
      resourceId: userId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log de logout
   */
  async logLogout(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.log({
      userId,
      action: 'LOGOUT',
      resource: 'User',
      resourceId: userId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log de falha de login
   */
  async logLoginFailed(
    email: string,
    reason: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.log({
      action: 'LOGIN_FAILED',
      resource: 'User',
      metadata: { email, reason },
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log de conta bloqueada por tentativas
   */
  async logAccountLocked(
    userId: string,
    attempts: number,
    lockUntil: Date,
    ipAddress?: string,
  ): Promise<void> {
    await this.log({
      userId,
      action: 'ACCOUNT_LOCKED',
      resource: 'User',
      resourceId: userId,
      metadata: { attempts, lockUntil: lockUntil.toISOString() },
      ipAddress,
    });
  }

  // ============================================
  // LOGS DE CRUD GENÉRICO
  // ============================================

  /**
   * Log de criação de recurso
   */
  async logCreate(
    userId: string,
    resource: string,
    resourceId: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      userId,
      action: 'CREATE',
      resource,
      resourceId,
      metadata,
    });
  }

  /**
   * Log de atualização de recurso
   */
  async logUpdate(
    userId: string,
    resource: string,
    resourceId: string,
    changes?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      userId,
      action: 'UPDATE',
      resource,
      resourceId,
      metadata: changes,
    });
  }

  /**
   * Log de deleção de recurso
   */
  async logDelete(
    userId: string,
    resource: string,
    resourceId: string,
  ): Promise<void> {
    await this.log({
      userId,
      action: 'DELETE',
      resource,
      resourceId,
    });
  }

  // ============================================
  // CONSULTAS
  // ============================================

  /**
   * Busca logs de auditoria por filtros
   */
  async findLogs(filters: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<AuditLogResult> {
    const { userId, action, resource, startDate, endDate, page = 1, limit = 50 } = filters;

    const where: any = {};

    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (resource) where.resource = resource;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Estatísticas de ações por usuário
   */
  async getUserStats(userId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await this.prisma.auditLog.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        action: true,
        resource: true,
      },
    });

    // Contar por ação
    const actionCounts = logs.reduce((acc: Record<string, number>, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {});

    // Contar por recurso
    const resourceCounts = logs.reduce((acc: Record<string, number>, log) => {
      acc[log.resource] = (acc[log.resource] || 0) + 1;
      return acc;
    }, {});

    return {
      totalActions: logs.length,
      actionCounts,
      resourceCounts,
      period: `${days} days`,
    };
  }
}
