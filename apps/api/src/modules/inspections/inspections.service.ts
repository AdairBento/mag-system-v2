import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { FilterInspectionDto } from './dto/filter-inspection.dto';

@Injectable()
export class InspectionsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateInspectionDto): Promise<any> { return this.prisma.inspection.create({ data: dto as any }); }
  async findAll(filter: FilterInspectionDto): Promise<any> {
    const skip = filter.skip ?? 0;
    const take = filter.take ?? 10;
    const [data, total] = await Promise.all([
      this.prisma.inspection.findMany({ skip, take }),
      this.prisma.inspection.count(),
    ]);
    return { data, total, page: Math.floor(skip / take) + 1, pageSize: take };
  }
  async findOne(id: string): Promise<any> { return this.prisma.inspection.findUnique({ where: { id } }); }
  async update(id: string, dto: UpdateInspectionDto): Promise<any> { return this.prisma.inspection.update({ where: { id }, data: dto as any }); }
  async remove(id: string): Promise<any> { return this.prisma.inspection.delete({ where: { id } }); }
}
