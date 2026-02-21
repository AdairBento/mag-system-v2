import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { FilterReportDto } from './dto/filter-report.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [totalClients, totalVehicles, activeRentals, pendingInvoices] = await Promise.all([
      this.prisma.client.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      this.prisma.vehicle.count({ where: { deletedAt: null } }),
      this.prisma.rental.count({ where: { status: 'ACTIVE' } }),
      this.prisma.invoice.count({ where: { status: 'PENDING' } }),
    ]);

    return { totalClients, totalVehicles, activeRentals, pendingInvoices };
  }

  async getRentalReport(filter: FilterReportDto) {
    const where: any = {};
    if (filter?.startDate) where.startDate = { gte: new Date(filter.startDate) };
    if (filter?.endDate) where.startDate = { ...where.startDate, lte: new Date(filter.endDate) };

    const [byStatus, revenueAgg] = await Promise.all([
      this.prisma.rental.groupBy({ by: ['status'], _count: { id: true }, where }),
      this.prisma.rental.aggregate({ where, _sum: { totalAmount: true } }),
    ]);

    return {
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count.id })),
      totalRevenue: revenueAgg._sum.totalAmount ?? 0,
    };
  }

  async getFleetReport() {
    const [byStatus, avgRate] = await Promise.all([
      this.prisma.vehicle.groupBy({ by: ['status'], _count: { id: true } }),
      this.prisma.vehicle.aggregate({ _avg: { dailyRate: true } }),
    ]);

    return {
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count.id })),
      avgDailyRate: avgRate._avg.dailyRate ?? 0,
    };
  }

  async getFinancialReport(filter: FilterReportDto) {
    const where: any = {};
    if (filter?.startDate) where.date = { gte: new Date(filter.startDate) };
    if (filter?.endDate) where.date = { ...where.date, lte: new Date(filter.endDate) };

    const [incomeAgg, expenseAgg] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { ...where, type: 'INCOME' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { ...where, type: 'EXPENSE' },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalIncome: incomeAgg._sum.amount ?? 0,
      totalExpense: expenseAgg._sum.amount ?? 0,
      net: Number(incomeAgg._sum.amount ?? 0) - Number(expenseAgg._sum.amount ?? 0),
    };
  }
}
