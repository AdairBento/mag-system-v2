import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Invoice, Transaction, TransactionType } from '@mag-system/database';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { FilterInvoiceDto } from './dto/filter-invoice.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class FinanceiroService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Invoices ─────────────────────────────────────────────────────────────
  async createInvoice(dto: CreateInvoiceDto): Promise<Invoice> {
    return this.prisma.invoice.create({
      data: {
        clientId: dto.clientId,
        invoiceNumber: dto.invoiceNumber,
        amount: dto.amount,
        dueDate: new Date(dto.dueDate),
        description: dto.description,
        rentalId: dto.rentalId ?? null,
        notes: dto.notes ?? null,
      },
    });
  }

  async findAllInvoices(filter: FilterInvoiceDto): Promise<PaginatedResult<Invoice>> {
    const { skip = 0, take = 10, clientId, rentalId, status, startDate, endDate } = filter || {};
    const where: any = {};
    if (clientId) where.clientId = clientId;
    if (rentalId) where.rentalId = rentalId;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.dueDate = {};
      if (startDate) where.dueDate.gte = new Date(startDate);
      if (endDate) where.dueDate.lte = new Date(endDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({ where, skip, take }),
      this.prisma.invoice.count({ where }),
    ]);
    return { data, total, page: Math.floor(skip / take) + 1, pageSize: take };
  }

  async findOneInvoice(id: string): Promise<Invoice | null> {
    return this.prisma.invoice.findUnique({ where: { id } });
  }

  async updateInvoice(id: string, dto: UpdateInvoiceDto): Promise<Invoice> {
    const data: any = { ...dto };
    if (dto.dueDate) data.dueDate = new Date(dto.dueDate);
    if (dto.paidDate) data.paidDate = new Date(dto.paidDate);
    return this.prisma.invoice.update({ where: { id }, data });
  }

  async removeInvoice(id: string): Promise<Invoice> {
    return this.prisma.invoice.delete({ where: { id } });
  }

  // ── Transactions ──────────────────────────────────────────────────────────
  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: {
        type: dto.type,
        category: dto.category,
        amount: dto.amount,
        date: new Date(dto.date),
        paymentMethod: dto.paymentMethod,
        description: dto.description,
        invoiceId: dto.invoiceId ?? null,
        reference: dto.reference ?? null,
      },
    });
  }

  async findAllTransactions(filter: FilterTransactionDto): Promise<PaginatedResult<Transaction>> {
    const { skip = 0, take = 10, type, status, invoiceId, startDate, endDate } = filter || {};
    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (invoiceId) where.invoiceId = invoiceId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.transaction.findMany({ where, skip, take }),
      this.prisma.transaction.count({ where }),
    ]);
    return { data, total, page: Math.floor(skip / take) + 1, pageSize: take };
  }

  async findOneTransaction(id: string): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({ where: { id } });
  }

  async updateTransaction(id: string, dto: UpdateTransactionDto): Promise<Transaction> {
    const data: any = { ...dto };
    if (dto.date) data.date = new Date(dto.date);
    return this.prisma.transaction.update({ where: { id }, data });
  }

  async removeTransaction(id: string): Promise<Transaction> {
    return this.prisma.transaction.delete({ where: { id } });
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  async getSummary() {
    const [incomeAgg, expenseAgg, pendingInvoices] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { type: TransactionType.INCOME },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { type: TransactionType.EXPENSE },
        _sum: { amount: true },
      }),
      this.prisma.invoice.count({ where: { status: 'PENDING' } }),
    ]);

    const totalIncome = Number(incomeAgg._sum.amount ?? 0);
    const totalExpense = Number(expenseAgg._sum.amount ?? 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      pendingInvoices,
    };
  }
}
