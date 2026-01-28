import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { FilterRentalDto } from './dto/filter-rental.dto';

@Injectable()
export class RentalsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateRentalDto): Promise<any> { return this.prisma.rental.create({ data: dto as any }); }
  async findAll(filter: FilterRentalDto): Promise<any> {
    const skip = filter.skip ?? 0;
    const take = filter.take ?? 10;
    const [data, total] = await Promise.all([
      this.prisma.rental.findMany({ skip, take }),
      this.prisma.rental.count(),
    ]);
    return { data, total, page: Math.floor(skip / take) + 1, pageSize: take };
  }
  async findOne(id: string): Promise<any> { return this.prisma.rental.findUnique({ where: { id } }); }
  async update(id: string, dto: UpdateRentalDto): Promise<any> { return this.prisma.rental.update({ where: { id }, data: dto as any }); }
  async remove(id: string): Promise<any> { return this.prisma.rental.delete({ where: { id } }); }
}
