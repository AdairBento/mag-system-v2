import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Rental, RentalStatus, VehicleStatus } from '@mag-system/database';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { FilterRentalDto } from './dto/filter-rental.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { differenceInDays, isAfter, isBefore, parseISO } from 'date-fns';

@Injectable()
export class RentalsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova locação
   */
  async create(dto: CreateRentalDto): Promise<Rental> {
    // 1. Validar datas
    this.validateDates(dto.startDate, dto.endDate);

    // 2. Verificar se cliente existe e está ativo
    const client = await this.prisma.client.findUnique({
      where: { id: dto.clientId },
    });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    if (client.status === 'BLOCKED') {
      throw new BadRequestException('Cliente bloqueado');
    }

    // 3. Verificar se motorista existe e está apto
    const driver = await this.prisma.driver.findUnique({
      where: { id: dto.driverId },
    });

    if (!driver) {
      throw new NotFoundException('Motorista não encontrado');
    }

    if (driver.status === 'SUSPENDED') {
      throw new BadRequestException('Motorista suspenso');
    }

    // Validar CNH não vencida
    if (isBefore(driver.licenseExpiresAt, new Date())) {
      throw new BadRequestException('CNH do motorista vencida');
    }

    // 4. Verificar disponibilidade do veículo
    await this.checkVehicleAvailability(
      dto.vehicleId,
      dto.startDate,
      dto.endDate,
    );

    // 5. Calcular valores
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: dto.vehicleId },
    });

    const totalDays = this.calculateDays(dto.startDate, dto.endDate);
    const dailyRate = vehicle.dailyRate;
    const subtotal = Number(dailyRate) * totalDays;
    const discount = dto.discount || 0;
    const totalAmount = subtotal - discount;

    // 6. Criar locação em transação
    return this.prisma.$transaction(async (tx) => {
      // Criar rental
      const rental = await tx.rental.create({
        data: {
          clientId: dto.clientId,
          driverId: dto.driverId,
          vehicleId: dto.vehicleId,
          startDate: dto.startDate,
          endDate: dto.endDate,
          dailyRate,
          totalDays,
          totalAmount,
          deposit: dto.deposit || 0,
          discount,
          status: RentalStatus.PENDING,
          notes: dto.notes,
        },
        include: {
          client: true,
          driver: true,
          vehicle: true,
        },
      });

      // Atualizar status do veículo (se começar hoje)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const startDate = new Date(dto.startDate);
      startDate.setHours(0, 0, 0, 0);

      if (startDate.getTime() === today.getTime()) {
        await tx.vehicle.update({
          where: { id: dto.vehicleId },
          data: { status: VehicleStatus.RENTED },
        });
      }

      return rental;
    });
  }

  /**
   * Lista locações com filtros e paginação
   */
  async findAll(filter: FilterRentalDto): Promise<PaginatedResult<Rental>> {
    const {
      page = 1,
      limit = 10,
      status,
      clientId,
      vehicleId,
      driverId,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filter;

    const skip = (page - 1) * limit;
    const take = limit;

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (clientId) {
      where.clientId = clientId;
    }

    if (vehicleId) {
      where.vehicleId = vehicleId;
    }

    if (driverId) {
      where.driverId = driverId;
    }

    if (startDateFrom || startDateTo) {
      where.startDate = {};
      if (startDateFrom) {
        where.startDate.gte = new Date(startDateFrom);
      }
      if (startDateTo) {
        where.startDate.lte = new Date(startDateTo);
      }
    }

    if (endDateFrom || endDateTo) {
      where.endDate = {};
      if (endDateFrom) {
        where.endDate.gte = new Date(endDateFrom);
      }
      if (endDateTo) {
        where.endDate.lte = new Date(endDateTo);
      }
    }

    // Build orderBy
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [data, total] = await Promise.all([
      this.prisma.rental.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          driver: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              licenseNumber: true,
            },
          },
          vehicle: {
            select: {
              id: true,
              plate: true,
              brand: true,
              model: true,
              year: true,
              color: true,
            },
          },
        },
      }),
      this.prisma.rental.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Busca locação por ID
   */
  async findOne(id: string): Promise<Rental> {
    const rental = await this.prisma.rental.findUnique({
      where: { id },
      include: {
        client: true,
        driver: true,
        vehicle: true,
        inspections: true,
        contract: true,
        invoices: true,
      },
    });

    if (!rental) {
      throw new NotFoundException('Locação não encontrada');
    }

    return rental;
  }

  /**
   * Atualiza locação
   */
  async update(id: string, dto: UpdateRentalDto): Promise<Rental> {
    // Verificar se existe
    const existing = await this.findOne(id);

    // Se mudar datas, validar
    if (dto.startDate || dto.endDate) {
      const startDate = dto.startDate || existing.startDate;
      const endDate = dto.endDate || existing.endDate;
      
      this.validateDates(startDate, endDate);

      // Verificar disponibilidade do veículo (excluindo esta locação)
      await this.checkVehicleAvailability(
        existing.vehicleId,
        startDate,
        endDate,
        id,
      );
    }

    // Recalcular valores se necessário
    let updateData: any = { ...dto };

    if (dto.startDate || dto.endDate || dto.discount !== undefined) {
      const startDate = dto.startDate || existing.startDate;
      const endDate = dto.endDate || existing.endDate;
      const totalDays = this.calculateDays(startDate, endDate);
      const subtotal = Number(existing.dailyRate) * totalDays;
      const discount = dto.discount !== undefined ? dto.discount : existing.discount;
      const totalAmount = subtotal - Number(discount);

      updateData = {
        ...updateData,
        totalDays,
        totalAmount,
      };
    }

    return this.prisma.rental.update({
      where: { id },
      data: updateData,
      include: {
        client: true,
        driver: true,
        vehicle: true,
      },
    });
  }

  /**
   * Cancela locação
   */
  async cancel(id: string): Promise<Rental> {
    const rental = await this.findOne(id);

    if (rental.status === RentalStatus.COMPLETED) {
      throw new BadRequestException('Locação já finalizada');
    }

    if (rental.status === RentalStatus.CANCELLED) {
      throw new BadRequestException('Locação já cancelada');
    }

    return this.prisma.$transaction(async (tx) => {
      // Cancelar locação
      const updated = await tx.rental.update({
        where: { id },
        data: { status: RentalStatus.CANCELLED },
      });

      // Liberar veículo
      await tx.vehicle.update({
        where: { id: rental.vehicleId },
        data: { status: VehicleStatus.AVAILABLE },
      });

      return updated;
    });
  }

  /**
   * Finaliza locação (devolução)
   */
  async complete(id: string, returnDate: Date): Promise<Rental> {
    const rental = await this.findOne(id);

    if (rental.status !== RentalStatus.ACTIVE) {
      throw new BadRequestException('Locação não está ativa');
    }

    return this.prisma.$transaction(async (tx) => {
      // Finalizar locação
      const updated = await tx.rental.update({
        where: { id },
        data: {
          status: RentalStatus.COMPLETED,
          returnDate,
        },
      });

      // Liberar veículo
      await tx.vehicle.update({
        where: { id: rental.vehicleId },
        data: { status: VehicleStatus.AVAILABLE },
      });

      return updated;
    });
  }

  /**
   * Remove locação (soft delete recomendado em produção)
   */
  async remove(id: string): Promise<Rental> {
    const rental = await this.findOne(id);

    // Apenas permitir deletar se estiver cancelada ou pending
    if (rental.status === RentalStatus.ACTIVE || rental.status === RentalStatus.COMPLETED) {
      throw new BadRequestException('Não é possível deletar locação ativa ou finalizada');
    }

    return this.prisma.rental.delete({ where: { id } });
  }

  /**
   * HELPERS
   */

  private validateDates(startDate: Date | string, endDate: Date | string): void {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

    if (isAfter(start, end)) {
      throw new BadRequestException('Data inicial não pode ser após data final');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDateOnly = new Date(start);
    startDateOnly.setHours(0, 0, 0, 0);

    if (isBefore(startDateOnly, today)) {
      throw new BadRequestException('Data inicial não pode ser no passado');
    }
  }

  private calculateDays(startDate: Date | string, endDate: Date | string): number {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    
    const days = differenceInDays(end, start);
    return days === 0 ? 1 : days; // Mínimo 1 dia
  }

  private async checkVehicleAvailability(
    vehicleId: string,
    startDate: Date | string,
    endDate: Date | string,
    excludeRentalId?: string,
  ): Promise<void> {
    // Verificar se veículo existe
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    if (vehicle.status === VehicleStatus.MAINTENANCE) {
      throw new BadRequestException('Veículo em manutenção');
    }

    if (vehicle.status === VehicleStatus.INACTIVE) {
      throw new BadRequestException('Veículo inativo');
    }

    // Verificar conflito de datas
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    const where: any = {
      vehicleId,
      status: {
        in: [RentalStatus.PENDING, RentalStatus.ACTIVE],
      },
      OR: [
        // Nova locação começa durante uma existente
        {
          AND: [
            { startDate: { lte: start } },
            { endDate: { gte: start } },
          ],
        },
        // Nova locação termina durante uma existente
        {
          AND: [
            { startDate: { lte: end } },
            { endDate: { gte: end } },
          ],
        },
        // Nova locação engloba uma existente
        {
          AND: [
            { startDate: { gte: start } },
            { endDate: { lte: end } },
          ],
        },
      ],
    };

    // Excluir locação atual se for update
    if (excludeRentalId) {
      where.id = { not: excludeRentalId };
    }

    const conflictingRental = await this.prisma.rental.findFirst({ where });

    if (conflictingRental) {
      throw new ConflictException(
        `Veículo já está reservado de ${conflictingRental.startDate.toLocaleDateString('pt-BR')} até ${conflictingRental.endDate.toLocaleDateString('pt-BR')}`,
      );
    }
  }
}
