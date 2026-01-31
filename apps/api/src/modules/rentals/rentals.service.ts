import { Injectable } from '@nestjs/common';
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
    return this.prisma.rental.create({ data: dto });
  }

  async findAll(filter: FilterRentalDto): Promise<PaginatedResult<Rental>> {
    const { skip = 0, take = 10 } = filter || {};

    const [data, total] = await Promise.all([
      this.prisma.rental.findMany({ skip, take }),
      this.prisma.rental.count(),
    ]);

    return {
      data,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async findOne(id: string): Promise<Rental | null> {
    return this.prisma.rental.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateRentalDto): Promise<Rental> {
    return this.prisma.rental.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<Rental> {
    return this.prisma.rental.delete({ where: { id } });
  }
}
