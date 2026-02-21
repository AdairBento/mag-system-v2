import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Insurance } from '@mag-system/database';
import { CreateSeguroDto } from './dto/create-seguro.dto';
import { UpdateSeguroDto } from './dto/update-seguro.dto';
import { FilterSeguroDto } from './dto/filter-seguro.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class SegurosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSeguroDto): Promise<Insurance> {
    return this.prisma.insurance.create({
      data: {
        vehicleId: dto.vehicleId,
        provider: dto.provider,
        policyNumber: dto.policyNumber,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        amount: dto.amount,
        coverageType: dto.coverageType,
        ...(dto.status ? { status: dto.status } : {}),
      },
      include: { vehicle: { select: { id: true, plate: true, brand: true, model: true } } },
    });
  }

  async findAll(filter: FilterSeguroDto): Promise<PaginatedResult<Insurance>> {
    const { skip = 0, take = 10, vehicleId, status, provider } = filter || {};
    const where: any = {};
    if (vehicleId) where.vehicleId = vehicleId;
    if (status) where.status = status;
    if (provider) where.provider = { contains: provider, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.insurance.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { vehicle: { select: { id: true, plate: true, brand: true, model: true } } },
      }),
      this.prisma.insurance.count({ where }),
    ]);

    return { data, total, page: Math.floor(skip / take) + 1, pageSize: take };
  }

  async findOne(id: string): Promise<Insurance> {
    const seguro = await this.prisma.insurance.findUnique({
      where: { id },
      include: {
        vehicle: { select: { id: true, plate: true, brand: true, model: true } },
        accidents: { orderBy: { date: 'desc' }, take: 10 },
      },
    });
    if (!seguro) throw new NotFoundException(`Seguro ${id} not found`);
    return seguro;
  }

  async findByVehicle(vehicleId: string): Promise<Insurance[]> {
    return this.prisma.insurance.findMany({
      where: { vehicleId },
      orderBy: { endDate: 'desc' },
      include: { vehicle: { select: { id: true, plate: true, brand: true, model: true } } },
    });
  }

  async findActive(): Promise<Insurance[]> {
    return this.prisma.insurance.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { endDate: 'asc' },
      include: { vehicle: { select: { id: true, plate: true, brand: true, model: true } } },
    });
  }

  async update(id: string, dto: UpdateSeguroDto): Promise<Insurance> {
    await this.findOne(id);
    return this.prisma.insurance.update({
      where: { id },
      data: {
        ...(dto.vehicleId !== undefined ? { vehicleId: dto.vehicleId } : {}),
        ...(dto.provider !== undefined ? { provider: dto.provider } : {}),
        ...(dto.policyNumber !== undefined ? { policyNumber: dto.policyNumber } : {}),
        ...(dto.startDate !== undefined ? { startDate: new Date(dto.startDate) } : {}),
        ...(dto.endDate !== undefined ? { endDate: new Date(dto.endDate) } : {}),
        ...(dto.amount !== undefined ? { amount: dto.amount } : {}),
        ...(dto.coverageType !== undefined ? { coverageType: dto.coverageType } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
      },
      include: { vehicle: { select: { id: true, plate: true, brand: true, model: true } } },
    });
  }

  async remove(id: string): Promise<Insurance> {
    await this.findOne(id);
    return this.prisma.insurance.delete({ where: { id } });
  }
}
