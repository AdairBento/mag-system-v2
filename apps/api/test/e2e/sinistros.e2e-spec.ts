import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, buildPrismaMock } from '../helpers/app.helper';

describe('Sinistros (e2e)', () => {
  let app: INestApplication;
  let prisma: ReturnType<typeof buildPrismaMock>;
  let token: string;

  const mockSinistro = {
    id: 'sinistro-1',
    vehicleId: 'vehicle-1',
    insuranceId: null,
    date: new Date('2026-02-10').toISOString(),
    location: 'Rua das Flores, 200 - SP',
    description: 'Colisão traseira',
    severity: 'MODERATE',
    estimatedCost: 5000,
    claimNumber: 'CLM-2026-001',
    status: 'OPEN',
    notes: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    documents: [],
    vehicle: { plate: 'ABC-1234', brand: 'Toyota', model: 'Corolla' },
  };

  const mockDocument = {
    id: 'doc-1',
    accidentId: 'sinistro-1',
    type: 'PHOTO',
    url: 'https://storage.example.com/sinistro-doc-1.jpg',
    description: 'Foto do dano',
    createdAt: new Date().toISOString(),
  };

  beforeAll(async () => {
    ({ app, prisma, token } = await createTestApp());
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => jest.clearAllMocks());

  describe('POST /api/sinistros', () => {
    it('creates a sinistro and returns 201', async () => {
      prisma.accident.create.mockResolvedValue(mockSinistro);

      const dto = {
        vehicleId: 'vehicle-1',
        date: '2026-02-10',
        location: 'Rua das Flores, 200 - SP',
        description: 'Colisão traseira',
        severity: 'MODERATE',
        estimatedCost: 5000,
        claimNumber: 'CLM-2026-001',
      };

      const res = await request(app.getHttpServer())
        .post('/api/sinistros')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(201);

      expect(res.body.id).toBe('sinistro-1');
      expect(res.body.severity).toBe('MODERATE');
      expect(prisma.accident.create).toHaveBeenCalled();
    });

    it('returns 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/api/sinistros')
        .set('Authorization', `Bearer ${token}`)
        .send({ vehicleId: 'vehicle-1' })
        .expect(400);
    });
  });

  describe('GET /api/sinistros', () => {
    it('returns paginated list', async () => {
      prisma.accident.findMany.mockResolvedValue([mockSinistro]);
      prisma.accident.count.mockResolvedValue(1);

      const res = await request(app.getHttpServer())
        .get('/api/sinistros')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0].id).toBe('sinistro-1');
      expect(res.body.total).toBe(1);
    });

    it('accepts severity filter', async () => {
      prisma.accident.findMany.mockResolvedValue([]);
      prisma.accident.count.mockResolvedValue(0);

      await request(app.getHttpServer())
        .get('/api/sinistros?severity=MODERATE')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('GET /api/sinistros/:id', () => {
    it('returns sinistro when found', async () => {
      prisma.accident.findUnique.mockResolvedValue(mockSinistro);

      const res = await request(app.getHttpServer())
        .get('/api/sinistros/sinistro-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.id).toBe('sinistro-1');
    });
  });

  describe('PUT /api/sinistros/:id', () => {
    it('updates sinistro', async () => {
      prisma.accident.update.mockResolvedValue({ ...mockSinistro, status: 'UNDER_REVIEW' });

      const res = await request(app.getHttpServer())
        .put('/api/sinistros/sinistro-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'UNDER_REVIEW' })
        .expect(200);

      expect(res.body.status).toBe('UNDER_REVIEW');
    });
  });

  describe('POST /api/sinistros/:id/documents', () => {
    it('adds a document to a sinistro', async () => {
      prisma.accidentDocument.create.mockResolvedValue(mockDocument);

      const dto = {
        type: 'PHOTO',
        url: 'https://storage.example.com/sinistro-doc-1.jpg',
        description: 'Foto do dano',
      };

      const res = await request(app.getHttpServer())
        .post('/api/sinistros/sinistro-1/documents')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(201);

      expect(res.body.id).toBe('doc-1');
      expect(prisma.accidentDocument.create).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/sinistros/:id', () => {
    it('deletes sinistro', async () => {
      prisma.accident.delete.mockResolvedValue(mockSinistro);

      const statusCode = await request(app.getHttpServer())
        .delete('/api/sinistros/sinistro-1')
        .set('Authorization', `Bearer ${token}`)
        .then((r) => r.status);

      expect([200, 204]).toContain(statusCode);
    });
  });
});
