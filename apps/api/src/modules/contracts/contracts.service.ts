import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Contract, ContractStatus } from '@mag-system/database';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { FilterContractDto } from './dto/filter-contract.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContractDto): Promise<Contract> {
    return this.prisma.contract.create({
      data: {
        rentalId: dto.rentalId,
        fileUrl: dto.fileUrl,
        signedBy: dto.signedBy ?? null,
        signedAt: dto.signedAt ? new Date(dto.signedAt) : null,
        status: dto.status ?? ContractStatus.PENDING,
      },
    });
  }

  async findAll(filter: FilterContractDto): Promise<PaginatedResult<Contract>> {
    const { skip = 0, take = 10, rentalId, status } = filter || {};
    const where: any = {};
    if (rentalId) where.rentalId = rentalId;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.contract.findMany({
        where,
        skip,
        take,
        include: { rental: { include: { client: true, vehicle: true } } },
      }),
      this.prisma.contract.count({ where }),
    ]);

    return { data, total, page: Math.floor(skip / take) + 1, pageSize: take };
  }

  async findOne(id: string): Promise<Contract | null> {
    return this.prisma.contract.findUnique({
      where: { id },
      include: { rental: { include: { client: true, vehicle: true } } },
    });
  }

  async update(id: string, dto: UpdateContractDto): Promise<Contract> {
    const data: any = { ...dto };
    if (dto.signedAt) data.signedAt = new Date(dto.signedAt);
    return this.prisma.contract.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Contract> {
    return this.prisma.contract.delete({ where: { id } });
  }

  async sign(id: string): Promise<Contract> {
    return this.prisma.contract.update({
      where: { id },
      data: { status: ContractStatus.SIGNED, signedAt: new Date() },
    });
  }
}
