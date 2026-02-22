import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Fine, FineStatus } from '@mag-system/database';
import { CreateMultaDto } from './dto/create-multa.dto';
import { UpdateMultaDto } from './dto/update-multa.dto';
import { FilterMultaDto } from './dto/filter-multa.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class MultasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMultaDto): Promise<Fine> {
    return this.prisma.fine.create({
      data: {
        vehicleId: dto.vehicleId,
        driverId: dto.driverId ?? null,
        date: new Date(dto.date),
        location: dto.location,
        description: dto.description,
        amount: dto.amount,
        dueDate: new Date(dto.dueDate),
        notes: dto.notes ?? null,
      },
    });
  }

  async findAll(filter: FilterMultaDto): Promise<PaginatedResult<Fine>> {
    const { skip = 0, take = 10, vehicleId, driverId, status, startDate, endDate } = filter || {};
    const where: any = {};
    if (vehicleId) where.vehicleId = vehicleId;
    if (driverId) where.driverId = driverId;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.dueDate = {};
      if (startDate) where.dueDate.gte = new Date(startDate);
      if (endDate) where.dueDate.lte = new Date(endDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.fine.findMany({ where, skip, take }),
      this.prisma.fine.count({ where }),
    ]);

    return { data, total, page: Math.floor(skip / take) + 1, pageSize: take };
  }

  async findOne(id: string): Promise<Fine | null> {
    return this.prisma.fine.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateMultaDto): Promise<Fine> {
    const data: any = { ...dto };
    if (dto.date) data.date = new Date(dto.date);
    if (dto.dueDate) data.dueDate = new Date(dto.dueDate);
    if (dto.paidDate) {
      data.paidDate = new Date(dto.paidDate);
      if (!dto.status) data.status = FineStatus.PAID;
    }
    return this.prisma.fine.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Fine> {
    return this.prisma.fine.delete({ where: { id } });
  }
}
