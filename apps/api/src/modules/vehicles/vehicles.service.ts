import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Vehicle } from '@mag-system/database';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { FilterVehicleDto } from './dto/filter-vehicle.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateVehicleDto): Promise<Vehicle> {
    return this.prisma.vehicle.create({ data: dto as any });
  }

  async findAll(filter: FilterVehicleDto): Promise<PaginatedResult<Vehicle>> {
    const { skip = 0, take = 10 } = filter || {};

    const [data, total] = await Promise.all([
      this.prisma.vehicle.findMany({ skip, take }),
      this.prisma.vehicle.count(),
    ]);

    return {
      data,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async findOne(id: string): Promise<Vehicle | null> {
    return this.prisma.vehicle.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateVehicleDto): Promise<Vehicle> {
    return this.prisma.vehicle.update({ where: { id }, data: dto as any });
  }

  async remove(id: string): Promise<Vehicle> {
    return this.prisma.vehicle.delete({ where: { id } });
  }
}
