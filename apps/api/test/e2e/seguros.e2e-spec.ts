import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, buildPrismaMock } from '../helpers/app.helper';

describe('Seguros (e2e)', () => {
  let app: INestApplication;
  let prisma: ReturnType<typeof buildPrismaMock>;
  let token: string;

  const mockSeguro = {
    id: 'seguro-1',
    vehicleId: 'vehicle-1',
    provider: 'Porto Seguro',
    policyNumber: 'POL-001',
    startDate: new Date('2026-01-01').toISOString(),
    endDate: new Date('2027-01-01').toISOString(),
    amount: 3600,
    coverageType: 'Total',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    vehicle: { id: 'vehicle-1', plate: 'ABC-1234', brand: 'Toyota', model: 'Corolla' },
  };

  beforeAll(async () => {
    ({ app, prisma, token } = await createTestApp());
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => jest.clearAllMocks());

  describe('POST /api/seguros', () => {
    it('creates a seguro and returns 201', async () => {
      prisma.insurance.create.mockResolvedValue(mockSeguro);

      const dto = {
        vehicleId: 'vehicle-1',
        provider: 'Porto Seguro',
        policyNumber: 'POL-001',
        startDate: '2026-01-01',
        endDate: '2027-01-01',
        amount: 3600,
        coverageType: 'Total',
      };

      const res = await request(app.getHttpServer())
        .post('/api/seguros')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(201);

      expect(res.body.policyNumber).toBe('POL-001');
      expect(prisma.insurance.create).toHaveBeenCalled();
    });

    it('returns 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/api/seguros')
        .set('Authorization', `Bearer ${token}`)
        .send({ provider: 'Porto Seguro' })
        .expect(400);
    });
  });

  describe('GET /api/seguros', () => {
    it('returns paginated list', async () => {
      prisma.insurance.findMany.mockResolvedValue([mockSeguro]);
      prisma.insurance.count.mockResolvedValue(1);

      const res = await request(app.getHttpServer())
        .get('/api/seguros')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0].id).toBe('seguro-1');
      expect(res.body.total).toBe(1);
    });

    it('accepts status filter', async () => {
      prisma.insurance.findMany.mockResolvedValue([]);
      prisma.insurance.count.mockResolvedValue(0);

      await request(app.getHttpServer())
        .get('/api/seguros?status=ACTIVE')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('GET /api/seguros/active', () => {
    it('returns active seguros', async () => {
      prisma.insurance.findMany.mockResolvedValue([mockSeguro]);

      const res = await request(app.getHttpServer())
        .get('/api/seguros/active')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/seguros/vehicle/:vehicleId', () => {
    it('returns seguros for a vehicle', async () => {
      prisma.insurance.findMany.mockResolvedValue([mockSeguro]);

      const res = await request(app.getHttpServer())
        .get('/api/seguros/vehicle/vehicle-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/seguros/:id', () => {
    it('returns seguro when found', async () => {
      prisma.insurance.findUnique.mockResolvedValue(mockSeguro);

      const res = await request(app.getHttpServer())
        .get('/api/seguros/seguro-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.id).toBe('seguro-1');
    });

    it('returns 404 when not found', async () => {
      prisma.insurance.findUnique.mockResolvedValue(null);

      await request(app.getHttpServer())
        .get('/api/seguros/nonexistent')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('PUT /api/seguros/:id', () => {
    it('updates seguro', async () => {
      prisma.insurance.findUnique.mockResolvedValue(mockSeguro);
      prisma.insurance.update.mockResolvedValue({ ...mockSeguro, status: 'EXPIRED' });

      const res = await request(app.getHttpServer())
        .put('/api/seguros/seguro-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'EXPIRED' })
        .expect(200);

      expect(res.body.status).toBe('EXPIRED');
    });
  });

  describe('DELETE /api/seguros/:id', () => {
    it('removes seguro and returns 204', async () => {
      prisma.insurance.findUnique.mockResolvedValue(mockSeguro);
      prisma.insurance.delete.mockResolvedValue(mockSeguro);

      await request(app.getHttpServer())
        .delete('/api/seguros/seguro-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });
  });
});
