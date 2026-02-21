import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, buildPrismaMock } from '../helpers/app.helper';

describe('Contracts (e2e)', () => {
  let app: INestApplication;
  let prisma: ReturnType<typeof buildPrismaMock>;
  let token: string;

  const mockContract = {
    id: 'contract-1',
    rentalId: 'rental-1',
    fileUrl: 'https://storage.example.com/contract-1.pdf',
    signedBy: null,
    signedAt: null,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rental: { id: 'rental-1', client: { name: 'João Silva' }, vehicle: { plate: 'ABC-1234' } },
  };

  beforeAll(async () => {
    ({ app, prisma, token } = await createTestApp());
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => jest.clearAllMocks());

  describe('POST /api/contracts', () => {
    it('creates a contract and returns 201', async () => {
      prisma.contract.create.mockResolvedValue(mockContract);

      const dto = {
        rentalId: 'rental-1',
        fileUrl: 'https://storage.example.com/contract-1.pdf',
      };

      const res = await request(app.getHttpServer())
        .post('/api/contracts')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(201);

      expect(res.body.id).toBe('contract-1');
      expect(res.body.status).toBe('PENDING');
      expect(prisma.contract.create).toHaveBeenCalled();
    });

    it('returns 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/api/contracts')
        .set('Authorization', `Bearer ${token}`)
        .send({ rentalId: 'rental-1' })
        .expect(400);
    });
  });

  describe('GET /api/contracts', () => {
    it('returns paginated list', async () => {
      prisma.contract.findMany.mockResolvedValue([mockContract]);
      prisma.contract.count.mockResolvedValue(1);

      const res = await request(app.getHttpServer())
        .get('/api/contracts')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0].id).toBe('contract-1');
      expect(res.body.total).toBe(1);
    });

    it('accepts rentalId filter', async () => {
      prisma.contract.findMany.mockResolvedValue([]);
      prisma.contract.count.mockResolvedValue(0);

      await request(app.getHttpServer())
        .get('/api/contracts?rentalId=rental-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('GET /api/contracts/:id', () => {
    it('returns contract when found', async () => {
      prisma.contract.findUnique.mockResolvedValue(mockContract);

      const res = await request(app.getHttpServer())
        .get('/api/contracts/contract-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.id).toBe('contract-1');
    });
  });

  describe('PUT /api/contracts/:id', () => {
    it('updates contract', async () => {
      prisma.contract.update.mockResolvedValue({ ...mockContract, signedBy: 'João Silva' });

      const res = await request(app.getHttpServer())
        .put('/api/contracts/contract-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ signedBy: 'João Silva' })
        .expect(200);

      expect(res.body.signedBy).toBe('João Silva');
    });
  });

  describe('POST /api/contracts/:id/sign', () => {
    it('signs a contract', async () => {
      prisma.contract.update.mockResolvedValue({ ...mockContract, status: 'SIGNED' });

      const res = await request(app.getHttpServer())
        .post('/api/contracts/contract-1/sign')
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      expect(res.body.status).toBe('SIGNED');
    });
  });

  describe('DELETE /api/contracts/:id', () => {
    it('deletes contract', async () => {
      prisma.contract.delete.mockResolvedValue(mockContract);

      const statusCode = await request(app.getHttpServer())
        .delete('/api/contracts/contract-1')
        .set('Authorization', `Bearer ${token}`)
        .then((r) => r.status);

      expect([200, 204]).toContain(statusCode);
    });
  });
});
