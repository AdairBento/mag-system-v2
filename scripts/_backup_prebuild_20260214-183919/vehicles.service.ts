import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { FilterVehicleDto } from './dto/filter-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVehicleDto) {
    return this.prisma.vehicle.create({ data: dto });
  }

  async findAll(filter?: FilterVehicleDto) {
    const page = filter?.page || 1;
    const limit = filter?.limit || 10;
    const skip = (page - 1) * limit;
    const take = limit;

    const where: any = {};

    if (filter?.search) {
      where.OR = [
        { plate: { contains: filter.search, mode: 'insensitive' } },
        { brand: { contains: filter.search, mode: 'insensitive' } },
        { model: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (filter?.status) where.status = filter.status;
    if (filter?.category) where.category = filter.category;

    const [items, total] = await Promise.all([
      this.prisma.vehicle.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      this.prisma.vehicle.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) throw new NotFoundException(`Vehicle #${id} not found`);
    return vehicle;
  }

  async update(id: string, dto: UpdateVehicleDto) {
    await this.findOne(id);
    return this.prisma.vehicle.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.vehicle.delete({ where: { id } });
  }
}
