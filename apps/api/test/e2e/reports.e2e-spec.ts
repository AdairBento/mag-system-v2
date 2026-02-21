import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, buildPrismaMock } from '../helpers/app.helper';

describe('Reports (e2e)', () => {
  let app: INestApplication;
  let prisma: ReturnType<typeof buildPrismaMock>;
  let token: string;

  beforeAll(async () => {
    ({ app, prisma, token } = await createTestApp());
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => jest.clearAllMocks());

  describe('GET /api/reports/dashboard', () => {
    it('returns dashboard summary', async () => {
      prisma.client.count.mockResolvedValue(42);
      prisma.vehicle.count.mockResolvedValue(15);
      prisma.rental.count.mockResolvedValue(8);
      prisma.invoice.count.mockResolvedValue(5);

      const res = await request(app.getHttpServer())
        .get('/api/reports/dashboard')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('totalClients');
      expect(res.body).toHaveProperty('totalVehicles');
      expect(res.body).toHaveProperty('activeRentals');
      expect(res.body).toHaveProperty('pendingInvoices');
      expect(res.body.totalClients).toBe(42);
    });
  });

  describe('GET /api/reports/rentals', () => {
    it('returns rental report', async () => {
      prisma.rental.groupBy.mockResolvedValue([
        { status: 'ACTIVE', _count: { id: 5 } },
        { status: 'COMPLETED', _count: { id: 20 } },
      ]);
      prisma.rental.aggregate.mockResolvedValue({
        _sum: { totalAmount: 18000 },
        _avg: {},
        _count: {},
      });

      const res = await request(app.getHttpServer())
        .get('/api/reports/rentals')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('byStatus');
      expect(res.body).toHaveProperty('totalRevenue');
      expect(Array.isArray(res.body.byStatus)).toBe(true);
    });

    it('accepts date range filters', async () => {
      prisma.rental.groupBy.mockResolvedValue([]);
      prisma.rental.aggregate.mockResolvedValue({ _sum: { totalAmount: 0 }, _avg: {}, _count: {} });

      await request(app.getHttpServer())
        .get('/api/reports/rentals?startDate=2026-01-01&endDate=2026-01-31')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('GET /api/reports/fleet', () => {
    it('returns fleet report', async () => {
      prisma.vehicle.groupBy.mockResolvedValue([
        { status: 'AVAILABLE', _count: { id: 10 } },
        { status: 'RENTED', _count: { id: 5 } },
      ]);
      prisma.vehicle.aggregate.mockResolvedValue({
        _avg: { dailyRate: 150 },
        _sum: {},
        _count: {},
      });

      const res = await request(app.getHttpServer())
        .get('/api/reports/fleet')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('byStatus');
      expect(res.body).toHaveProperty('avgDailyRate');
      expect(res.body.avgDailyRate).toBe(150);
    });
  });

  describe('GET /api/reports/financial', () => {
    it('returns financial report', async () => {
      prisma.transaction.aggregate
        .mockResolvedValueOnce({ _sum: { amount: 50000 }, _avg: {}, _count: {} }) // INCOME
        .mockResolvedValueOnce({ _sum: { amount: 20000 }, _avg: {}, _count: {} }); // EXPENSE

      const res = await request(app.getHttpServer())
        .get('/api/reports/financial')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('totalIncome');
      expect(res.body).toHaveProperty('totalExpense');
      expect(res.body).toHaveProperty('net');
      expect(res.body.totalIncome).toBe(50000);
      expect(res.body.net).toBe(30000);
    });

    it('accepts date range filters', async () => {
      prisma.transaction.aggregate.mockResolvedValue({ _sum: { amount: 0 }, _avg: {}, _count: {} });

      await request(app.getHttpServer())
        .get('/api/reports/financial?startDate=2026-01-01&endDate=2026-01-31')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });
});
