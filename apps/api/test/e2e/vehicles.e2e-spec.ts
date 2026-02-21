import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, buildPrismaMock } from '../helpers/app.helper';

describe('Vehicles (e2e)', () => {
  let app: INestApplication;
  let prisma: ReturnType<typeof buildPrismaMock>;
  let token: string;

  const mockVehicle = {
    id: 'vehicle-1',
    plate: 'ABC-1234',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2023,
    color: 'Branco',
    category: 'SEDAN',
    status: 'AVAILABLE',
    fuelType: 'FLEX',
    transmission: 'AUTOMATIC',
    dailyRate: 150,
    mileage: 10000,
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

  describe('GET /api/vehicles', () => {
    it('returns paginated vehicle list', async () => {
      prisma.vehicle.findMany.mockResolvedValue([mockVehicle]);
      prisma.vehicle.count.mockResolvedValue(1);

      const res = await request(app.getHttpServer())
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.total).toBe(1);
    });

    it('accepts status filter', async () => {
      prisma.vehicle.findMany.mockResolvedValue([]);
      prisma.vehicle.count.mockResolvedValue(0);

      await request(app.getHttpServer())
        .get('/api/vehicles?status=AVAILABLE')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(prisma.vehicle.findMany).toHaveBeenCalled();
    });
  });

  describe('POST /api/vehicles', () => {
    it('creates vehicle and returns 201', async () => {
      prisma.vehicle.create.mockResolvedValue(mockVehicle);

      const dto = {
        plate: 'ABC-1234',
        registrationNumber: '12345678901234567',
        chassis: '9BWZZZ377VT004251',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2023,
        color: 'Branco',
        category: 'SEDAN',
        fuelType: 'FLEX',
        transmission: 'AUTOMATIC',
        seats: 5,
        km: 10000,
        dailyRate: 150,
        status: 'AVAILABLE',
      };

      const res = await request(app.getHttpServer())
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(201);

      expect(res.body.plate).toBe('ABC-1234');
    });

    it('returns 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${token}`)
        .send({ brand: 'Toyota' })
        .expect(400);
    });
  });

  describe('GET /api/vehicles/:id', () => {
    it('returns vehicle when found', async () => {
      prisma.vehicle.findUnique.mockResolvedValue(mockVehicle);

      const res = await request(app.getHttpServer())
        .get('/api/vehicles/vehicle-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.id).toBe('vehicle-1');
      expect(res.body.brand).toBe('Toyota');
    });

    it('returns 404 when not found', async () => {
      prisma.vehicle.findUnique.mockResolvedValue(null);

      await request(app.getHttpServer())
        .get('/api/vehicles/nonexistent')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    it('updates vehicle status', async () => {
      prisma.vehicle.findUnique.mockResolvedValue(mockVehicle);
      prisma.vehicle.update.mockResolvedValue({ ...mockVehicle, status: 'MAINTENANCE' });

      const res = await request(app.getHttpServer())
        .put('/api/vehicles/vehicle-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'MAINTENANCE' })
        .expect(200);

      expect(res.body.status).toBe('MAINTENANCE');
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    it('deletes vehicle', async () => {
      prisma.vehicle.findUnique.mockResolvedValue(mockVehicle);
      prisma.vehicle.delete.mockResolvedValue(mockVehicle);

      const statusCode = await request(app.getHttpServer())
        .delete('/api/vehicles/vehicle-1')
        .set('Authorization', `Bearer ${token}`)
        .then((r) => r.status);

      expect([200, 204]).toContain(statusCode);
    });
  });
});
