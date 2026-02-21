import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, buildPrismaMock } from '../helpers/app.helper';

describe('Multas (e2e)', () => {
  let app: INestApplication;
  let prisma: ReturnType<typeof buildPrismaMock>;
  let token: string;

  const mockMulta = {
    id: 'multa-1',
    vehicleId: 'vehicle-1',
    driverId: null,
    date: new Date('2026-02-15').toISOString(),
    location: 'Av. Paulista, 1000 - SP',
    description: 'Excesso de velocidade',
    amount: 195.23,
    dueDate: new Date('2026-03-15').toISOString(),
    paidDate: null,
    status: 'PENDING',
    notes: null,
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

  describe('POST /api/multas', () => {
    it('creates a multa and returns 201', async () => {
      prisma.fine.create.mockResolvedValue(mockMulta);

      const dto = {
        vehicleId: 'vehicle-1',
        date: '2026-02-15',
        location: 'Av. Paulista, 1000 - SP',
        description: 'Excesso de velocidade',
        amount: 195.23,
        dueDate: '2026-03-15',
      };

      const res = await request(app.getHttpServer())
        .post('/api/multas')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(201);

      expect(res.body.id).toBe('multa-1');
      expect(res.body.status).toBe('PENDING');
      expect(prisma.fine.create).toHaveBeenCalled();
    });

    it('returns 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/api/multas')
        .set('Authorization', `Bearer ${token}`)
        .send({ vehicleId: 'vehicle-1' })
        .expect(400);
    });
  });

  describe('GET /api/multas', () => {
    it('returns paginated list', async () => {
      prisma.fine.findMany.mockResolvedValue([mockMulta]);
      prisma.fine.count.mockResolvedValue(1);

      const res = await request(app.getHttpServer())
        .get('/api/multas')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0].id).toBe('multa-1');
      expect(res.body.total).toBe(1);
    });

    it('accepts status filter', async () => {
      prisma.fine.findMany.mockResolvedValue([]);
      prisma.fine.count.mockResolvedValue(0);

      await request(app.getHttpServer())
        .get('/api/multas?status=PENDING')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('GET /api/multas/:id', () => {
    it('returns multa when found', async () => {
      prisma.fine.findUnique.mockResolvedValue(mockMulta);

      const res = await request(app.getHttpServer())
        .get('/api/multas/multa-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.id).toBe('multa-1');
      expect(res.body.description).toBe('Excesso de velocidade');
    });
  });

  describe('PUT /api/multas/:id', () => {
    it('updates multa status', async () => {
      prisma.fine.update.mockResolvedValue({
        ...mockMulta,
        status: 'PAID',
        paidDate: new Date().toISOString(),
      });

      const res = await request(app.getHttpServer())
        .put('/api/multas/multa-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ paidDate: '2026-02-20' })
        .expect(200);

      expect(res.body.status).toBe('PAID');
    });
  });

  describe('DELETE /api/multas/:id', () => {
    it('deletes multa', async () => {
      prisma.fine.delete.mockResolvedValue(mockMulta);

      const statusCode = await request(app.getHttpServer())
        .delete('/api/multas/multa-1')
        .set('Authorization', `Bearer ${token}`)
        .then((r) => r.status);

      expect([200, 204]).toContain(statusCode);
    });
  });
});
