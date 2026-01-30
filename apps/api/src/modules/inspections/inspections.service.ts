import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Inspection } from '@mag-system/database';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { FilterInspectionDto } from './dto/filter-inspection.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class InspectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInspectionDto): Promise<Inspection> {
    return this.prisma.inspection.create({ data: dto as any });
  }

  async findAll(filter: FilterInspectionDto): Promise<PaginatedResult<Inspection>> {
    const { skip = 0, take = 10 } = filter || {};

    const [data, total] = await Promise.all([
      this.prisma.inspection.findMany({ skip, take }),
      this.prisma.inspection.count(),
    ]);

    return {
      data,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async findOne(id: string): Promise<Inspection | null> {
    return this.prisma.inspection.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateInspectionDto): Promise<Inspection> {
    return this.prisma.inspection.update({ where: { id }, data: dto as any });
  }

  async remove(id: string): Promise<Inspection> {
    return this.prisma.inspection.delete({ where: { id } });
  }
}
