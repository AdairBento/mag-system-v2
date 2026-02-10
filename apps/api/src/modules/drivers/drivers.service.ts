import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Driver } from '@mag-system/database';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { FilterDriverDto } from './dto/filter-driver.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo motorista
   * Se já existir motorista com mesmo CPF, lança ConflictException com dados do motorista existente
   */
  async create(dto: CreateDriverDto): Promise<Driver> {
    // Verificar se já existe motorista com este CPF
    const existing = await this.prisma.driver.findUnique({
      where: { document: dto.document },
      include: { client: true },
    });

    if (existing) {
      throw new ConflictException({
        message: 'Já existe um motorista cadastrado com este CPF',
        driver: {
          id: existing.id,
          name: existing.name,
          document: existing.document,
          currentClient: existing.client?.name || 'Sem vínculo',
        },
      });
    }

    // Validar cliente se fornecido
    if (dto.clientId) {
      const client = await this.prisma.client.findUnique({
        where: { id: dto.clientId },
      });

      if (!client) {
        throw new NotFoundException(`Cliente ${dto.clientId} não encontrado`);
      }

      if (client.documentType !== 'CNPJ') {
        throw new BadRequestException(
          'Motoristas só podem ser vinculados a clientes Pessoa Jurídica (CNPJ)',
        );
      }
    }

    return this.prisma.driver.create({
      data: dto,
      include: { client: true },
    });
  }

  /**
   * Lista motoristas com filtros e paginação
   */
  async findAll(filter: FilterDriverDto): Promise<PaginatedResult<Driver>> {
    const { skip = 0, take = 10, search, clientId } = filter || {};

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { document: { contains: search.replace(/\D/g, '') } },
        { licenseNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (clientId) {
      where.clientId = clientId;
    }

    const [data, total] = await Promise.all([
      this.prisma.driver.findMany({
        where,
        skip,
        take,
        include: { client: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.driver.count({ where }),
    ]);

    // Adicionar clientName ao resultado
    const enrichedData = data.map((driver) => ({
      ...driver,
      clientName: driver.client?.name || null,
    }));

    return {
      data: enrichedData as any,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  /**
   * Busca motorista por ID
   */
  async findOne(id: string): Promise<Driver | null> {
    return this.prisma.driver.findUnique({
      where: { id },
      include: { client: true },
    });
  }

  /**
   * Atualiza motorista
   */
  async update(id: string, dto: UpdateDriverDto): Promise<Driver> {
    const driver = await this.prisma.driver.findUnique({ where: { id } });

    if (!driver) {
      throw new NotFoundException(`Motorista ${id} não encontrado`);
    }

    // Se estiver mudando o clientId, validar
    if (dto.clientId && dto.clientId !== driver.clientId) {
      const client = await this.prisma.client.findUnique({
        where: { id: dto.clientId },
      });

      if (!client) {
        throw new NotFoundException(`Cliente ${dto.clientId} não encontrado`);
      }

      if (client.documentType !== 'CNPJ') {
        throw new BadRequestException(
          'Motoristas só podem ser vinculados a clientes Pessoa Jurídica (CNPJ)',
        );
      }
    }

    return this.prisma.driver.update({
      where: { id },
      data: dto,
      include: { client: true },
    });
  }

  /**
   * Remove motorista
   */
  async remove(id: string): Promise<Driver> {
    const driver = await this.prisma.driver.findUnique({ where: { id } });

    if (!driver) {
      throw new NotFoundException(`Motorista ${id} não encontrado`);
    }

    return this.prisma.driver.delete({ where: { id } });
  }

  /**
   * 🔄 MIGRAÇÃO: Transfere motorista de um cliente para outro
   */
  async migrateDriver(
    driverId: string,
    newClientId: string,
  ): Promise<Driver> {
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
      include: { client: true },
    });

    if (!driver) {
      throw new NotFoundException(`Motorista ${driverId} não encontrado`);
    }

    const newClient = await this.prisma.client.findUnique({
      where: { id: newClientId },
    });

    if (!newClient) {
      throw new NotFoundException(`Cliente ${newClientId} não encontrado`);
    }

    if (newClient.documentType !== 'CNPJ') {
      throw new BadRequestException(
        'Motoristas só podem ser migrados para clientes Pessoa Jurídica (CNPJ)',
      );
    }

    // Atualizar vínculo
    return this.prisma.driver.update({
      where: { id: driverId },
      data: { clientId: newClientId },
      include: { client: true },
    });
  }
}
