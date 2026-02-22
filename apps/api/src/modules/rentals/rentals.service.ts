import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Rental } from '@mag-system/database';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { FilterRentalDto } from './dto/filter-rental.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class RentalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRentalDto): Promise<Rental> {
    return this.prisma.rental.create({
      data: {
        clientId: dto.clientId,
        driverId: dto.driverId,
        vehicleId: dto.vehicleId,
        startDate: dto.startDate,
        expectedEndDate: dto.expectedEndDate,
        dailyRate: dto.dailyRate,
        totalDays: dto.totalDays,
        totalAmount: dto.totalAmount,
        deposit: dto.deposit ?? 0,
        discount: dto.discount ?? 0,
        notes: dto.notes ?? null,
      },
    });
  }

  async findAll(filter: FilterRentalDto): Promise<PaginatedResult<Rental>> {
    const { skip = 0, take = 10, status, clientId, vehicleId, driverId } = filter || {};

    const where: Record<string, unknown> = {};
    if (status) where['status'] = status;
    if (clientId) where['clientId'] = clientId;
    if (vehicleId) where['vehicleId'] = vehicleId;
    if (driverId) where['driverId'] = driverId;

    const [data, total] = await Promise.all([
      this.prisma.rental.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      this.prisma.rental.count({ where }),
    ]);

    return {
      data,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async findOne(id: string): Promise<Rental> {
    const rental = await this.prisma.rental.findUnique({ where: { id } });
    if (!rental) throw new NotFoundException(`Rental #${id} not found`);
    return rental;
  }

  async update(id: string, dto: UpdateRentalDto): Promise<Rental> {
    return this.prisma.rental.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<Rental> {
    return this.prisma.rental.delete({ where: { id } });
  }
}
