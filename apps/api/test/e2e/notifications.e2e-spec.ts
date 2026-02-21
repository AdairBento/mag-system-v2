import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, buildPrismaMock } from '../helpers/app.helper';

describe('Notifications (e2e)', () => {
  let app: INestApplication;
  let prisma: ReturnType<typeof buildPrismaMock>;
  let token: string;

  const mockLog = {
    id: 'log-1',
    userId: 'user-1',
    action: 'CREATE',
    resource: 'client',
    resourceId: 'client-1',
    metadata: null,
    createdAt: new Date().toISOString(),
  };

  beforeAll(async () => {
    ({ app, prisma, token } = await createTestApp());
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => jest.clearAllMocks());

  describe('POST /api/notifications', () => {
    it('creates a notification (audit log entry)', async () => {
      prisma.auditLog.create.mockResolvedValue(mockLog);

      const dto = {
        action: 'CREATE',
        resource: 'client',
        resourceId: 'client-1',
        userId: 'user-1',
      };

      const res = await request(app.getHttpServer())
        .post('/api/notifications')
        .set('Authorization', `Bearer ${token}`)
        .send(dto)
        .expect(201);

      expect(res.body.action).toBe('CREATE');
      expect(prisma.auditLog.create).toHaveBeenCalled();
    });

    it('returns 400 for missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/api/notifications')
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: 'user-1' })
        .expect(400);
    });
  });

  describe('GET /api/notifications', () => {
    it('returns paginated list', async () => {
      prisma.auditLog.findMany.mockResolvedValue([mockLog]);
      prisma.auditLog.count.mockResolvedValue(1);

      const res = await request(app.getHttpServer())
        .get('/api/notifications')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.data[0].action).toBe('CREATE');
      expect(res.body.total).toBe(1);
    });

    it('accepts query filters', async () => {
      prisma.auditLog.findMany.mockResolvedValue([]);
      prisma.auditLog.count.mockResolvedValue(0);

      await request(app.getHttpServer())
        .get('/api/notifications?resource=client&action=CREATE')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('GET /api/notifications/recent', () => {
    it('returns list of recent notifications', async () => {
      prisma.auditLog.findMany.mockResolvedValue([mockLog]);

      const res = await request(app.getHttpServer())
        .get('/api/notifications/recent')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].id).toBe('log-1');
    });
  });
});
