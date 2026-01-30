import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Client } from '@mag-system/database';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FilterClientDto } from './dto/filter-client.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClientDto): Promise<Client> {
    return this.prisma.client.create({ data: dto as any });
  }

  async findAll(filter: FilterClientDto): Promise<PaginatedResult<Client>> {
    const { skip = 0, take = 10 } = filter || {};

    const [data, total] = await Promise.all([
      this.prisma.client.findMany({ skip, take }),
      this.prisma.client.count(),
    ]);

    return {
      data,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async findOne(id: string): Promise<Client | null> {
    return this.prisma.client.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    return this.prisma.client.update({ where: { id }, data: dto as any });
  }

  async remove(id: string): Promise<Client> {
    return this.prisma.client.delete({ where: { id } });
  }
}
