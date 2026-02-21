import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, buildPrismaMock } from '../helpers/app.helper';

describe('Settings (e2e)', () => {
  let app: INestApplication;
  let prisma: ReturnType<typeof buildPrismaMock>;
  let token: string;

  const mockSetting = {
    id: 'setting-1',
    key: 'max_rentals_per_client',
    value: '5',
    type: 'number',
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

  describe('POST /api/settings', () => {
    it('creates a setting and returns 201', async () => {
      prisma.setting.create.mockResolvedValue(mockSetting);

      const dto = {
        key: 'max_rentals_per_client',
        value: '5',
        type: 'number',
      };

      const res = await request(app.getHttpServer())
        .post('/api/settings')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(201);

      expect(res.body.key).toBe('max_rentals_per_client');
      expect(res.body.value).toBe('5');
      expect(prisma.setting.create).toHaveBeenCalled();
    });

    it('returns 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/api/settings')
        .set('Authorization', `Bearer ${token}`)
        .send({ key: 'only-key' })
        .expect(400);
    });
  });

  describe('GET /api/settings', () => {
    it('returns paginated list', async () => {
      prisma.setting.findMany.mockResolvedValue([mockSetting]);
      prisma.setting.count.mockResolvedValue(1);

      const res = await request(app.getHttpServer())
        .get('/api/settings')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0].key).toBe('max_rentals_per_client');
      expect(res.body.total).toBe(1);
    });
  });

  describe('GET /api/settings/key/:key', () => {
    it('returns setting by key', async () => {
      prisma.setting.findUnique.mockResolvedValue(mockSetting);

      const res = await request(app.getHttpServer())
        .get('/api/settings/key/max_rentals_per_client')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.key).toBe('max_rentals_per_client');
    });
  });

  describe('PUT /api/settings/key/:key', () => {
    it('upserts setting by key', async () => {
      prisma.setting.upsert.mockResolvedValue({ ...mockSetting, value: '10' });

      const res = await request(app.getHttpServer())
        .put('/api/settings/key/max_rentals_per_client')
        .set('Authorization', `Bearer ${token}`)
        .send({ value: '10' })
        .expect(200);

      expect(res.body.value).toBe('10');
    });
  });

  describe('GET /api/settings/:id', () => {
    it('returns setting by id', async () => {
      prisma.setting.findUnique.mockResolvedValue(mockSetting);

      const res = await request(app.getHttpServer())
        .get('/api/settings/setting-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.id).toBe('setting-1');
    });
  });

  describe('PUT /api/settings/:id', () => {
    it('updates setting', async () => {
      prisma.setting.update.mockResolvedValue({ ...mockSetting, value: '3' });

      const res = await request(app.getHttpServer())
        .put('/api/settings/setting-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ value: '3' })
        .expect(200);

      expect(res.body.value).toBe('3');
    });
  });

  describe('DELETE /api/settings/:id', () => {
    it('deletes setting', async () => {
      prisma.setting.delete.mockResolvedValue(mockSetting);

      const statusCode = await request(app.getHttpServer())
        .delete('/api/settings/setting-1')
        .set('Authorization', `Bearer ${token}`)
        .then((r) => r.status);

      expect([200, 204]).toContain(statusCode);
    });
  });
});
