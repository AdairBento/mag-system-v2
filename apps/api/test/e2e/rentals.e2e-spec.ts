import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, buildPrismaMock } from '../helpers/app.helper';

describe('Rentals (e2e)', () => {
  let app: INestApplication;
  let prisma: ReturnType<typeof buildPrismaMock>;
  let token: string;

  const mockRental = {
    id: 'rental-1',
    clientId: 'client-1',
    vehicleId: 'vehicle-1',
    startDate: new Date('2026-01-01').toISOString(),
    endDate: new Date('2026-01-07').toISOString(),
    dailyRate: 150,
    totalAmount: 900,
    status: 'ACTIVE',
    notes: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    client: { id: 'client-1', name: 'João Silva' },
    vehicle: { id: 'vehicle-1', plate: 'ABC-1234', brand: 'Toyota', model: 'Corolla' },
  };

  beforeAll(async () => {
    ({ app, prisma, token } = await createTestApp());
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => jest.clearAllMocks());

  describe('GET /api/rentals', () => {
    it('returns paginated rental list', async () => {
      prisma.rental.findMany.mockResolvedValue([mockRental]);
      prisma.rental.count.mockResolvedValue(1);

      const res = await request(app.getHttpServer())
        .get('/api/rentals')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0].id).toBe('rental-1');
      expect(res.body.total).toBe(1);
    });

    it('accepts status filter', async () => {
      prisma.rental.findMany.mockResolvedValue([]);
      prisma.rental.count.mockResolvedValue(0);

      await request(app.getHttpServer())
        .get('/api/rentals?status=ACTIVE')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('POST /api/rentals', () => {
    it('creates rental and returns 201', async () => {
      prisma.vehicle.findUnique.mockResolvedValue({ id: 'vehicle-1', status: 'AVAILABLE' });
      prisma.rental.create.mockResolvedValue(mockRental);

      const dto = {
        clientId: 'client-1',
        driverId: 'driver-1',
        vehicleId: 'vehicle-1',
        startDate: '2026-01-01',
        endDate: '2026-01-07',
        dailyRate: 150,
        totalDays: 6,
        totalAmount: 900,
      };

      const res = await request(app.getHttpServer())
        .post('/api/rentals')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(201);

      expect(res.body.id).toBe('rental-1');
    });

    it('returns 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/api/rentals')
        .set('Authorization', `Bearer ${token}`)
        .send({ clientId: 'client-1' })
        .expect(400);
    });
  });

  describe('GET /api/rentals/:id', () => {
    it('returns rental when found', async () => {
      prisma.rental.findUnique.mockResolvedValue(mockRental);

      const res = await request(app.getHttpServer())
        .get('/api/rentals/rental-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.id).toBe('rental-1');
      expect(res.body.status).toBe('ACTIVE');
    });

    it('returns 404 when not found', async () => {
      prisma.rental.findUnique.mockResolvedValue(null);

      await request(app.getHttpServer())
        .get('/api/rentals/nonexistent')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('PUT /api/rentals/:id', () => {
    it('updates rental status', async () => {
      prisma.rental.update.mockResolvedValue({ ...mockRental, notes: 'Contrato encerrado' });

      const res = await request(app.getHttpServer())
        .put('/api/rentals/rental-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ notes: 'Contrato encerrado' })
        .expect(200);

      expect(res.body.id).toBe('rental-1');
    });
  });
});
