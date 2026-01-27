import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateClientDto,
  UpdateClientDto,
  FilterClientDto,
  ClientResponseDto,
  PaginatedResponseDto,
} from '@mag-system/core';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto): Promise<ClientResponseDto> {
    const client = await this.prisma.client.create({
      data: createClientDto,
    });

    return client as ClientResponseDto;
  }

  async findAll(
    filters: FilterClientDto,
  ): Promise<PaginatedResponseDto<ClientResponseDto>> {
    const { page = 1, limit = 10, ...where } = filters;
    const skip = (page - 1) * limit;

    const [clients, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.count({ where }),
    ]);

    return {
      data: clients as ClientResponseDto[],
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<ClientResponseDto> {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    return client as ClientResponseDto;
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto,
  ): Promise<ClientResponseDto> {
    await this.findOne(id);

    const client = await this.prisma.client.update({
      where: { id },
      data: updateClientDto,
    });

    return client as ClientResponseDto;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.client.delete({ where: { id } });
  }
}
