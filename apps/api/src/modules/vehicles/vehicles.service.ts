import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { FilterVehicleDto } from './dto/filter-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateVehicleDto): Promise<any> { return this.prisma.vehicle.create({ data: dto as any }); }
  async findAll(filter: FilterVehicleDto): Promise<any> {
    const skip = filter.skip ?? 0;
    const take = filter.take ?? 10;
    const [data, total] = await Promise.all([
      this.prisma.vehicle.findMany({ skip, take }),
      this.prisma.vehicle.count(),
    ]);
    return { data, total, page: Math.floor(skip / take) + 1, pageSize: take };
  }
  async findOne(id: string): Promise<any> { return this.prisma.vehicle.findUnique({ where: { id } }); }
  async update(id: string, dto: UpdateVehicleDto): Promise<any> { return this.prisma.vehicle.update({ where: { id }, data: dto as any }); }
  async remove(id: string): Promise<any> { return this.prisma.vehicle.delete({ where: { id } }); }
}
