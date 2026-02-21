import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AuditLog } from '@mag-system/database';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { FilterNotificationDto } from './dto/filter-notification.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNotificationDto): Promise<AuditLog> {
    return this.prisma.auditLog.create({
      data: {
        userId: dto.userId ?? null,
        action: dto.action,
        resource: dto.resource,
        resourceId: dto.resourceId ?? null,
        ...(dto.metadata !== undefined ? { metadata: dto.metadata } : {}),
      },
    });
  }

  async findAll(filter: FilterNotificationDto): Promise<PaginatedResult<AuditLog>> {
    const { skip = 0, take = 10, userId, resource, action } = filter || {};
    const where: any = {};
    if (userId) where.userId = userId;
    if (resource) where.resource = resource;
    if (action) where.action = action;

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data, total, page: Math.floor(skip / take) + 1, pageSize: take };
  }

  async findRecent(limit = 20): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
