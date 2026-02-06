import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Client, ClientStatus, Prisma } from '@mag-system/database';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FilterClientDto } from './dto/filter-client.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import {
  isValidCPF,
  isValidCNPJ,
  normalizeDocument,
} from '@mag-system/core';

/**
 * Service de Clientes com validações de negócio
 *
 * Padrão:
 * 1. Validar regras de negócio ANTES de acessar DB
 * 2. Verificar duplicidade ANTES de criar
 * 3. Normalizar dados (remover máscaras)
 * 4. Usar where consistente em findMany + count
 */
@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria novo cliente
   * Valida CPF/CNPJ e verifica duplicidade
   */
  async create(dto: CreateClientDto): Promise<Client> {
    // 1. Validar formato do documento (CPF ou CNPJ)
    const isValid =
      dto.documentType === 'CPF'
        ? isValidCPF(dto.document)
        : isValidCNPJ(dto.document);

    if (!isValid) {
      throw new BadRequestException(
        `${dto.documentType} inválido: ${dto.document}`,
      );
    }

    // 2. Normalizar documento (remover máscara)
    const normalizedDocument = normalizeDocument(dto.document);

    // 3. Verificar se já existe cliente com mesmo documento
    const existingClient = await this.prisma.client.findUnique({
      where: { document: normalizedDocument },
    });

    if (existingClient) {
      throw new ConflictException(
        `Já existe um cliente cadastrado com o ${dto.documentType} ${dto.document}`,
      );
    }

    // 4. Verificar se já existe cliente com mesmo email
    const existingEmail = await this.prisma.client.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingEmail) {
      throw new ConflictException(
        `Já existe um cliente cadastrado com o email ${dto.email}`,
      );
    }

    // 5. Criar cliente com documento normalizado
    return this.prisma.client.create({
      data: {
        ...dto,
        document: normalizedDocument,
        email: dto.email.toLowerCase(),
      },
    });
  }

  /**
   * Lista clientes com paginação e filtros
   */
  async findAll(filter: FilterClientDto): Promise<PaginatedResult<Client>> {
    const {
      skip = 0,
      take = 10,
      status,
      documentType,
      search,
      orderBy = 'createdAt',
      order = 'desc',
    } = filter || {};

    // Construir where com filtros
    const where: Prisma.ClientWhereInput = {};

    // Filtro por status
    if (status) {
      where.status = status as ClientStatus;
    }

    // Filtro por tipo de documento
    if (documentType) {
      where.documentType = documentType;
    }

    // Busca por nome, email ou documento
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { document: { contains: search } },
      ];
    }

    // Executar queries em paralelo com mesmo where
    const [data, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip,
        take,
        orderBy: { [orderBy]: order },
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

  /**
   * Busca cliente por ID
   * Lança NotFoundException se não encontrado
   */
  async findOne(id: string): Promise<Client> {
    const client = await this.prisma.client.findUnique({ where: { id } });

    if (!client) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    return client;
  }

  /**
   * Atualiza cliente
   * Valida documento se fornecido
   */
  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    // Verificar se cliente existe
    await this.findOne(id);

    // Validar documento se fornecido
    if (dto.document && dto.documentType) {
      const isValid =
        dto.documentType === 'CPF'
          ? isValidCPF(dto.document)
          : isValidCNPJ(dto.document);

      if (!isValid) {
        throw new BadRequestException(
          `${dto.documentType} inválido: ${dto.document}`,
        );
      }

      dto.document = normalizeDocument(dto.document);
    }

    // Normalizar email se fornecido
    if (dto.email) {
      dto.email = dto.email.toLowerCase();
    }

    return this.prisma.client.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Remove cliente (soft delete alterando status)
   */
  async remove(id: string): Promise<Client> {
    // Verificar se cliente existe
    await this.findOne(id);

    // Verificar se cliente tem locações ativas
    const activeRentals = await this.prisma.rental.count({
      where: {
        clientId: id,
        status: { in: ['PENDING', 'ACTIVE'] },
      },
    });

    if (activeRentals > 0) {
      throw new ConflictException(
        'Não é possível remover cliente com locações ativas',
      );
    }

    // Soft delete (inativar)
    return this.prisma.client.update({
      where: { id },
      data: { status: ClientStatus.INACTIVE },
    });
  }
}
