import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Driver } from '@mag-system/database';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { FilterDriverDto } from './dto/filter-driver.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDriverDto): Promise<Driver> {
    return this.prisma.driver.create({ data: dto as any });
  }

  async findAll(filter: FilterDriverDto): Promise<PaginatedResult<Driver>> {
    const { skip = 0, take = 10 } = filter || {};

    const [data, total] = await Promise.all([
      this.prisma.driver.findMany({ skip, take }),
      this.prisma.driver.count(),
    ]);

    return {
      data,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async findOne(id: string): Promise<Driver | null> {
    return this.prisma.driver.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateDriverDto): Promise<Driver> {
    return this.prisma.driver.update({ where: { id }, data: dto as any });
  }

  async remove(id: string): Promise<Driver> {
    return this.prisma.driver.delete({ where: { id } });
  }
}
