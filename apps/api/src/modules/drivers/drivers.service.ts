import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { FilterDriverDto } from './dto/filter-driver.dto';

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateDriverDto): Promise<any> { return this.prisma.driver.create({ data: dto as any }); }
  async findAll(filter: FilterDriverDto): Promise<any> {
    const skip = filter.skip ?? 0;
    const take = filter.take ?? 10;
    const [data, total] = await Promise.all([
      this.prisma.driver.findMany({ skip, take }),
      this.prisma.driver.count(),
    ]);
    return { data, total, page: Math.floor(skip / take) + 1, pageSize: take };
  }
  async findOne(id: string): Promise<any> { return this.prisma.driver.findUnique({ where: { id } }); }
  async update(id: string, dto: UpdateDriverDto): Promise<any> { return this.prisma.driver.update({ where: { id }, data: dto as any }); }
  async remove(id: string): Promise<any> { return this.prisma.driver.delete({ where: { id } }); }
}
