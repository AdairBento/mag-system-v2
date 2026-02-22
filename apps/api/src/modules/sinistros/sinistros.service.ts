import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Accident, AccidentDocument } from '@mag-system/database';
import { CreateSinistroDto } from './dto/create-sinistro.dto';
import { UpdateSinistroDto } from './dto/update-sinistro.dto';
import { FilterSinistroDto } from './dto/filter-sinistro.dto';
import { CreateSinistroDocumentDto } from './dto/create-sinistro-document.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class SinistrosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSinistroDto): Promise<Accident> {
    return this.prisma.accident.create({
      data: {
        vehicleId: dto.vehicleId,
        insuranceId: dto.insuranceId ?? null,
        date: new Date(dto.date),
        location: dto.location,
        description: dto.description,
        severity: dto.severity,
        estimatedCost: dto.estimatedCost ?? null,
        claimNumber: dto.claimNumber ?? null,
        notes: dto.notes ?? null,
      },
    });
  }

  async findAll(filter: FilterSinistroDto): Promise<PaginatedResult<Accident>> {
    const { skip = 0, take = 10, vehicleId, severity, status, startDate, endDate } = filter || {};
    const where: any = {};
    if (vehicleId) where.vehicleId = vehicleId;
    if (severity) where.severity = severity;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.accident.findMany({
        where,
        skip,
        take,
        include: {
          documents: true,
          vehicle: { select: { plate: true, brand: true, model: true } },
          insurance: true,
        },
      }),
      this.prisma.accident.count({ where }),
    ]);

    return { data, total, page: Math.floor(skip / take) + 1, pageSize: take };
  }

  async findOne(id: string): Promise<Accident | null> {
    return this.prisma.accident.findUnique({
      where: { id },
      include: {
        documents: true,
        vehicle: { select: { plate: true, brand: true, model: true } },
        insurance: true,
      },
    });
  }

  async update(id: string, dto: UpdateSinistroDto): Promise<Accident> {
    const data: any = { ...dto };
    if (dto.date) data.date = new Date(dto.date);
    return this.prisma.accident.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Accident> {
    return this.prisma.accident.delete({ where: { id } });
  }

  async addDocument(id: string, dto: CreateSinistroDocumentDto): Promise<AccidentDocument> {
    return this.prisma.accidentDocument.create({
      data: {
        accidentId: id,
        type: dto.type,
        url: dto.url,
        description: dto.description ?? null,
      },
    });
  }
}
