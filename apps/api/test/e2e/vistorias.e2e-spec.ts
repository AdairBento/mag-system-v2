import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, buildPrismaMock } from '../helpers/app.helper';

describe('Vistorias (e2e)', () => {
  let app: INestApplication;
  let prisma: ReturnType<typeof buildPrismaMock>;
  let token: string;

  const mockDamage = {
    id: 'damage-1',
    inspectionId: 'inspection-1',
    description: 'Amassado na porta traseira direita',
    severity: 'MINOR',
    location: 'Porta traseira direita',
    estimatedCost: 800,
    createdAt: new Date().toISOString(),
  };

  const mockPhoto = {
    id: 'photo-1',
    inspectionId: 'inspection-1',
    url: 'https://storage.example.com/vistoria-photo-1.jpg',
    description: 'Foto frontal do veículo',
    createdAt: new Date().toISOString(),
  };

  beforeAll(async () => {
    ({ app, prisma, token } = await createTestApp());
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => jest.clearAllMocks());

  // ── Damages ──────────────────────────────────────────────────────────────

  describe('POST /api/vistorias/damages', () => {
    it('records a damage and returns 201', async () => {
      prisma.damage.create.mockResolvedValue(mockDamage);

      const dto = {
        inspectionId: 'inspection-1',
        description: 'Amassado na porta traseira direita',
        severity: 'MINOR',
        location: 'Porta traseira direita',
        estimatedCost: 800,
      };

      const res = await request(app.getHttpServer())
        .post('/api/vistorias/damages')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(201);

      expect(res.body.id).toBe('damage-1');
      expect(res.body.severity).toBe('MINOR');
    });

    it('returns 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/api/vistorias/damages')
        .set('Authorization', `Bearer ${token}`)
        .send({ inspectionId: 'inspection-1' })
        .expect(400);
    });
  });

  describe('GET /api/vistorias/damages/:inspectionId', () => {
    it('returns damages for an inspection', async () => {
      prisma.damage.findMany.mockResolvedValue([mockDamage]);

      const res = await request(app.getHttpServer())
        .get('/api/vistorias/damages/inspection-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].id).toBe('damage-1');
    });
  });

  describe('PATCH /api/vistorias/damages/:id', () => {
    it('updates a damage', async () => {
      prisma.damage.update.mockResolvedValue({ ...mockDamage, severity: 'MODERATE' });

      const res = await request(app.getHttpServer())
        .patch('/api/vistorias/damages/damage-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ severity: 'MODERATE' })
        .expect(200);

      expect(res.body.severity).toBe('MODERATE');
    });
  });

  describe('DELETE /api/vistorias/damages/:id', () => {
    it('deletes a damage', async () => {
      prisma.damage.delete.mockResolvedValue(mockDamage);

      const statusCode = await request(app.getHttpServer())
        .delete('/api/vistorias/damages/damage-1')
        .set('Authorization', `Bearer ${token}`)
        .then((r) => r.status);

      expect([200, 204]).toContain(statusCode);
    });
  });

  // ── Photos ────────────────────────────────────────────────────────────────

  describe('POST /api/vistorias/photos', () => {
    it('creates a photo and returns 201', async () => {
      prisma.inspectionPhoto.create.mockResolvedValue(mockPhoto);

      const dto = {
        inspectionId: 'inspection-1',
        url: 'https://storage.example.com/vistoria-photo-1.jpg',
        description: 'Foto frontal do veículo',
      };

      const res = await request(app.getHttpServer())
        .post('/api/vistorias/photos')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(201);

      expect(res.body.id).toBe('photo-1');
      expect(res.body.url).toBe('https://storage.example.com/vistoria-photo-1.jpg');
    });

    it('returns 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/api/vistorias/photos')
        .set('Authorization', `Bearer ${token}`)
        .send({ inspectionId: 'inspection-1' })
        .expect(400);
    });
  });

  describe('GET /api/vistorias/photos/:inspectionId', () => {
    it('returns photos for an inspection', async () => {
      prisma.inspectionPhoto.findMany.mockResolvedValue([mockPhoto]);

      const res = await request(app.getHttpServer())
        .get('/api/vistorias/photos/inspection-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].id).toBe('photo-1');
    });
  });

  describe('DELETE /api/vistorias/photos/:id', () => {
    it('deletes a photo', async () => {
      prisma.inspectionPhoto.delete.mockResolvedValue(mockPhoto);

      const statusCode = await request(app.getHttpServer())
        .delete('/api/vistorias/photos/photo-1')
        .set('Authorization', `Bearer ${token}`)
        .then((r) => r.status);

      expect([200, 204]).toContain(statusCode);
    });
  });

  // ── Summary ───────────────────────────────────────────────────────────────

  describe('GET /api/vistorias/summary/:inspectionId', () => {
    it('returns inspection summary', async () => {
      prisma.damage.findMany.mockResolvedValue([mockDamage]);
      prisma.damage.count.mockResolvedValue(1);
      prisma.inspectionPhoto.count.mockResolvedValue(2);

      const res = await request(app.getHttpServer())
        .get('/api/vistorias/summary/inspection-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('damages');
      expect(res.body).toHaveProperty('photos');
    });
  });
});
