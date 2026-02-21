import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, buildPrismaMock } from '../helpers/app.helper';

describe('Maintenance (e2e)', () => {
  let app: INestApplication;
  let prisma: ReturnType<typeof buildPrismaMock>;
  let token: string;

  const mockMaintenance = {
    id: 'maint-1',
    vehicleId: 'vehicle-1',
    type: 'PREVENTIVE',
    description: 'Revisão de 10.000 km',
    scheduledDate: new Date('2026-03-01').toISOString(),
    completedDate: null,
    cost: 450,
    mileage: 10000,
    status: 'SCHEDULED',
    notes: null,
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

  describe('POST /api/maintenance', () => {
    it('creates a maintenance record and returns 201', async () => {
      prisma.maintenance.create.mockResolvedValue(mockMaintenance);

      const dto = {
        vehicleId: 'vehicle-1',
        type: 'PREVENTIVE',
        description: 'Revisão de 10.000 km',
        scheduledDate: '2026-03-01',
        cost: 450,
        mileage: 10000,
      };

      const res = await request(app.getHttpServer())
        .post('/api/maintenance')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(201);

      expect(res.body.id).toBe('maint-1');
      expect(res.body.type).toBe('PREVENTIVE');
      expect(prisma.maintenance.create).toHaveBeenCalled();
    });

    it('returns 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/api/maintenance')
        .set('Authorization', `Bearer ${token}`)
        .send({ vehicleId: 'vehicle-1' })
        .expect(400);
    });
  });

  describe('GET /api/maintenance', () => {
    it('returns paginated list', async () => {
      prisma.maintenance.findMany.mockResolvedValue([mockMaintenance]);
      prisma.maintenance.count.mockResolvedValue(1);

      const res = await request(app.getHttpServer())
        .get('/api/maintenance')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0].id).toBe('maint-1');
      expect(res.body.total).toBe(1);
    });

    it('accepts vehicleId filter', async () => {
      prisma.maintenance.findMany.mockResolvedValue([]);
      prisma.maintenance.count.mockResolvedValue(0);

      await request(app.getHttpServer())
        .get('/api/maintenance?vehicleId=vehicle-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('GET /api/maintenance/vehicle/:vehicleId', () => {
    it('returns maintenance records for a vehicle', async () => {
      prisma.maintenance.findMany.mockResolvedValue([mockMaintenance]);
      prisma.maintenance.count.mockResolvedValue(1);

      const res = await request(app.getHttpServer())
        .get('/api/maintenance/vehicle/vehicle-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('data');
    });
  });

  describe('GET /api/maintenance/:id', () => {
    it('returns maintenance when found', async () => {
      prisma.maintenance.findUnique.mockResolvedValue(mockMaintenance);

      const res = await request(app.getHttpServer())
        .get('/api/maintenance/maint-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.id).toBe('maint-1');
    });
  });

  describe('PUT /api/maintenance/:id', () => {
    it('updates maintenance record', async () => {
      prisma.maintenance.update.mockResolvedValue({ ...mockMaintenance, status: 'COMPLETED' });

      const res = await request(app.getHttpServer())
        .put('/api/maintenance/maint-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ completedDate: '2026-03-01' })
        .expect(200);

      expect(res.body.id).toBe('maint-1');
    });
  });

  describe('DELETE /api/maintenance/:id', () => {
    it('deletes maintenance record', async () => {
      prisma.maintenance.delete.mockResolvedValue(mockMaintenance);

      const statusCode = await request(app.getHttpServer())
        .delete('/api/maintenance/maint-1')
        .set('Authorization', `Bearer ${token}`)
        .then((r) => r.status);

      expect([200, 204]).toContain(statusCode);
    });
  });
});
