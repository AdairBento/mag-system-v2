import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, buildPrismaMock } from '../helpers/app.helper';

describe('Clients (e2e)', () => {
  let app: INestApplication;
  let prisma: ReturnType<typeof buildPrismaMock>;
  let token: string;

  const mockClient = {
    id: 'client-1',
    name: 'João Silva',
    document: '123.456.789-09',
    documentType: 'CPF',
    email: 'joao@example.com',
    phone: '11999999999',
    status: 'ACTIVE',
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

  describe('GET /api/clients', () => {
    it('returns paginated list', async () => {
      prisma.client.findMany.mockResolvedValue([mockClient]);
      prisma.client.count.mockResolvedValue(1);

      const res = await request(app.getHttpServer())
        .get('/api/clients')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.total).toBe(1);
    });

    it('accepts query params (search, status)', async () => {
      prisma.client.findMany.mockResolvedValue([]);
      prisma.client.count.mockResolvedValue(0);

      await request(app.getHttpServer())
        .get('/api/clients?name=joao&status=ACTIVE')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(prisma.client.findMany).toHaveBeenCalled();
    });
  });

  describe('POST /api/clients', () => {
    it('creates a client and returns 201', async () => {
      prisma.client.create.mockResolvedValue(mockClient);

      const dto = {
        name: 'João Silva',
        document: '123.456.789-09',
        documentType: 'CPF',
        email: 'joao@example.com',
        phone: '11999999999',
      };

      const res = await request(app.getHttpServer())
        .post('/api/clients')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(201);

      expect(res.body.name).toBe('João Silva');
      expect(prisma.client.create).toHaveBeenCalled();
    });

    it('returns 400 for invalid body (missing required fields)', async () => {
      await request(app.getHttpServer())
        .post('/api/clients')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Only Name' })
        .expect(400);
    });
  });

  describe('GET /api/clients/:id', () => {
    it('returns client when found', async () => {
      prisma.client.findUnique.mockResolvedValue(mockClient);

      const res = await request(app.getHttpServer())
        .get('/api/clients/client-1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.id).toBe('client-1');
    });

    it('returns 404 when not found', async () => {
      prisma.client.findUnique.mockResolvedValue(null);

      await request(app.getHttpServer())
        .get('/api/clients/nonexistent')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('PATCH /api/clients/:id', () => {
    it('updates and returns client', async () => {
      prisma.client.findUnique.mockResolvedValue(mockClient);
      prisma.client.update.mockResolvedValue({ ...mockClient, name: 'João Atualizado' });

      const res = await request(app.getHttpServer())
        .patch('/api/clients/client-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'João Atualizado' })
        .expect(200);

      expect(res.body.name).toBe('João Atualizado');
    });
  });

  describe('DELETE /api/clients/:id', () => {
    it('soft-deletes client and returns 204 or 200', async () => {
      prisma.client.findUnique.mockResolvedValue(mockClient);
      prisma.client.update.mockResolvedValue({ ...mockClient, status: 'INACTIVE' });

      const statusCode = await request(app.getHttpServer())
        .delete('/api/clients/client-1')
        .set('Authorization', `Bearer ${token}`)
        .then((r) => r.status);

      expect([200, 204]).toContain(statusCode);
    });
  });
});
