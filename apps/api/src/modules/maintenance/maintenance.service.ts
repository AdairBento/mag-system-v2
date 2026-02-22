import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Maintenance, MaintenanceStatus } from '@mag-system/database';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { FilterMaintenanceDto } from './dto/filter-maintenance.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class MaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMaintenanceDto): Promise<Maintenance> {
    return this.prisma.maintenance.create({
      data: {
        vehicleId: dto.vehicleId,
        type: dto.type,
        description: dto.description,
        scheduledDate: new Date(dto.scheduledDate),
        cost: dto.cost ?? 0,
        mileage: dto.mileage ?? 0,
        notes: dto.notes ?? null,
      },
    });
  }

  async findAll(filter: FilterMaintenanceDto): Promise<PaginatedResult<Maintenance>> {
    const { skip = 0, take = 10, vehicleId, type, status, startDate, endDate } = filter || {};
    const where: any = {};
    if (vehicleId) where.vehicleId = vehicleId;
    if (type) where.type = type;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.scheduledDate = {};
      if (startDate) where.scheduledDate.gte = new Date(startDate);
      if (endDate) where.scheduledDate.lte = new Date(endDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.maintenance.findMany({
        where,
        skip,
        take,
        include: { vehicle: { select: { plate: true, brand: true, model: true } } },
      }),
      this.prisma.maintenance.count({ where }),
    ]);

    return { data, total, page: Math.floor(skip / take) + 1, pageSize: take };
  }

  async findOne(id: string): Promise<Maintenance | null> {
    return this.prisma.maintenance.findUnique({
      where: { id },
      include: { vehicle: { select: { plate: true, brand: true, model: true } } },
    });
  }

  async findByVehicle(
    vehicleId: string,
    filter: FilterMaintenanceDto
  ): Promise<PaginatedResult<Maintenance>> {
    return this.findAll({ ...filter, vehicleId });
  }

  async update(id: string, dto: UpdateMaintenanceDto): Promise<Maintenance> {
    const data: any = { ...dto };
    if (dto.scheduledDate) data.scheduledDate = new Date(dto.scheduledDate);
    if (dto.completedDate) {
      data.completedDate = new Date(dto.completedDate);
      if (!dto.status) data.status = MaintenanceStatus.COMPLETED;
    }
    return this.prisma.maintenance.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Maintenance> {
    return this.prisma.maintenance.delete({ where: { id } });
  }
}
