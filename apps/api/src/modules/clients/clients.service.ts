import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.prisma.client.create({ data: dto });
  }

  async findAll(filter: FilterClientDto): Promise<PaginatedResult<Client>> {
    const { skip = 0, take = 10, status, documentType, name, email, document } = filter || {};

    // ✅ Construir WHERE dinâmico
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (documentType) {
      where.documentType = documentType;
    }

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }

    if (email) {
      where.email = { contains: email, mode: 'insensitive' };
    }

    if (document) {
      where.document = { contains: document };
    }

    const [data, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.count({ where }),
    ]);

    return {
      data,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) throw new NotFoundException(`Client #${id} not found`);
    return client;
  }

  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    return this.prisma.client.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<Client> {
    return this.prisma.client.delete({ where: { id } });
  }
}
