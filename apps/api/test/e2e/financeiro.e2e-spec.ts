import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, buildPrismaMock } from '../helpers/app.helper';

describe('Financeiro (e2e)', () => {
  let app: INestApplication;
  let prisma: ReturnType<typeof buildPrismaMock>;
  let token: string;

  const mockInvoice = {
    id: 'invoice-1',
    clientId: 'client-1',
    invoiceNumber: 'INV-2026-001',
    amount: 900,
    dueDate: new Date('2026-03-01').toISOString(),
    description: 'Locação veículo ABC-1234',
    status: 'PENDING',
    paidDate: null,
    rentalId: null,
    notes: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockTransaction = {
    id: 'tx-1',
    type: 'INCOME',
    category: 'Locação',
    amount: 900,
    date: new Date('2026-02-20').toISOString(),
    paymentMethod: 'PIX',
    description: 'Pagamento locação',
    status: 'COMPLETED',
    invoiceId: null,
    reference: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeAll(async () => {
    ({ app, prisma, token } = await createTestApp());
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => jest.clearAllMocks());

  describe('GET /api/financeiro/summary', () => {
    it('returns financial summary', async () => {
      prisma.transaction.aggregate.mockResolvedValue({
        _sum: { amount: 1000 },
        _avg: {},
        _count: {},
      });
      prisma.invoice.count.mockResolvedValue(3);

      const res = await request(app.getHttpServer())
        .get('/api/financeiro/summary')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('totalIncome');
      expect(res.body).toHaveProperty('totalExpense');
    });
  });

  describe('POST /api/financeiro/invoices', () => {
    it('creates invoice and returns 201', async () => {
      prisma.invoice.create.mockResolvedValue(mockInvoice);

      const dto = {
        clientId: 'client-1',
        invoiceNumber: 'INV-2026-001',
        amount: 900,
        dueDate: '2026-03-01',
        description: 'Locação veículo ABC-1234',
      };

      const res = await request(app.getHttpServer())
        .post('/api/financeiro/invoices')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(201);

      expect(res.body.id).toBe('invoice-1');
      expect(res.body.invoiceNumber).toBe('INV-2026-001');
    });

    it('returns 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/api/financeiro/invoices')
        .set('Authorization', `Bearer ${token}`)
        .send({ clientId: 'client-1' })
        .expect(400);
    });
  });

  describe('GET /api/financeiro/invoices', () => {
    it('returns paginated invoice list', async () => {
      prisma.invoice.findMany.mockResolvedValue([mockInvoice]);
      prisma.invoice.count.mockResolvedValue(1);

      const res = await request(app.getHttpServer())
        .get('/api/financeiro/invoices')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0].id).toBe('invoice-1');
    });
  });

  describe('GET /api/financeiro/invoices/:id', () => {
    it('returns invoice when found', async () => {
      prisma.invoice.findUnique.mockResolvedValue(mockInvoice);

      const res = await request(app.getHttpServer())
        .get('/api/financeiro/invoices/invoice-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.id).toBe('invoice-1');
    });
  });

  describe('PUT /api/financeiro/invoices/:id', () => {
    it('updates invoice', async () => {
      prisma.invoice.update.mockResolvedValue({ ...mockInvoice, status: 'PAID' });

      const res = await request(app.getHttpServer())
        .put('/api/financeiro/invoices/invoice-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ paidDate: '2026-02-25' })
        .expect(200);

      expect(res.body.id).toBe('invoice-1');
    });
  });

  describe('DELETE /api/financeiro/invoices/:id', () => {
    it('deletes invoice', async () => {
      prisma.invoice.delete.mockResolvedValue(mockInvoice);

      const statusCode = await request(app.getHttpServer())
        .delete('/api/financeiro/invoices/invoice-1')
        .set('Authorization', `Bearer ${token}`)
        .then((r) => r.status);

      expect([200, 204]).toContain(statusCode);
    });
  });

  describe('POST /api/financeiro/transactions', () => {
    it('creates transaction and returns 201', async () => {
      prisma.transaction.create.mockResolvedValue(mockTransaction);

      const dto = {
        type: 'INCOME',
        category: 'Locação',
        amount: 900,
        date: '2026-02-20',
        paymentMethod: 'PIX',
        description: 'Pagamento locação',
      };

      const res = await request(app.getHttpServer())
        .post('/api/financeiro/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(201);

      expect(res.body.id).toBe('tx-1');
      expect(res.body.type).toBe('INCOME');
    });

    it('returns 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/api/financeiro/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'INCOME' })
        .expect(400);
    });
  });

  describe('GET /api/financeiro/transactions', () => {
    it('returns paginated transaction list', async () => {
      prisma.transaction.findMany.mockResolvedValue([mockTransaction]);
      prisma.transaction.count.mockResolvedValue(1);

      const res = await request(app.getHttpServer())
        .get('/api/financeiro/transactions')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0].id).toBe('tx-1');
    });
  });

  describe('GET /api/financeiro/transactions/:id', () => {
    it('returns transaction when found', async () => {
      prisma.transaction.findUnique.mockResolvedValue(mockTransaction);

      const res = await request(app.getHttpServer())
        .get('/api/financeiro/transactions/tx-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.id).toBe('tx-1');
    });
  });
});
