import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { DocumentType, ClientStatus } from '@mag-system/database';

describe('Clients (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Limpar banco de testes
    await prisma.client.deleteMany();
    await prisma.user.deleteMany();

    // Criar usuário de teste e obter token
    const user = await prisma.user.create({
      data: {
        email: 'test@test.com',
        password: '$2b$10$hashedpassword', // bcrypt hash
        name: 'Test User',
        role: 'ADMIN',
      },
    });

    // Fazer login (assumindo que /auth/login existe)
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password123',
      });

    authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /api/clients', () => {
    it('should create a new client with valid CPF', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'João da Silva',
          email: 'joao@example.com',
          phone: '11987654321',
          document: '12345678900',
          documentType: DocumentType.CPF,
          address: 'Rua Teste, 123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01310100',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('João da Silva');
      expect(response.body.document).toBe('12345678900');
    });

    it('should return 400 for invalid CPF', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Maria Santos',
          email: 'maria@example.com',
          phone: '11987654321',
          document: '11111111111', // CPF inválido
          documentType: DocumentType.CPF,
        })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.message).toContain('CPF inválido');
    });

    it('should return 409 for duplicate document', async () => {
      // Criar primeiro cliente
      await prisma.client.create({
        data: {
          name: 'Cliente 1',
          email: 'cliente1@example.com',
          phone: '11987654321',
          document: '98765432100',
          documentType: DocumentType.CPF,
        },
      });

      // Tentar criar com mesmo CPF
      const response = await request(app.getHttpServer())
        .post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Cliente 2',
          email: 'cliente2@example.com',
          phone: '11987654322',
          document: '98765432100',
          documentType: DocumentType.CPF,
        })
        .expect(409);

      expect(response.body.error.code).toBe('CONFLICT');
      expect(response.body.error.message).toContain('já cadastrado');
    });

    it('should normalize document (remove masks)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Cliente Normalizado',
          email: 'normalizado@example.com',
          phone: '(11) 98765-4321',
          document: '123.456.789-00',
          documentType: DocumentType.CPF,
          zipCode: '01310-100',
        })
        .expect(201);

      expect(response.body.document).toBe('12345678900');
      expect(response.body.phone).toBe('11987654321');
      expect(response.body.zipCode).toBe('01310100');
    });
  });

  describe('GET /api/clients', () => {
    beforeEach(async () => {
      await prisma.client.deleteMany();

      // Criar clientes de teste
      await prisma.client.createMany({
        data: [
          {
            name: 'Cliente A',
            email: 'clientea@example.com',
            phone: '11111111111',
            document: '11111111111',
            documentType: DocumentType.CPF,
            status: ClientStatus.ACTIVE,
          },
          {
            name: 'Cliente B',
            email: 'clienteb@example.com',
            phone: '22222222222',
            document: '22222222222',
            documentType: DocumentType.CPF,
            status: ClientStatus.ACTIVE,
          },
          {
            name: 'Cliente C Blocked',
            email: 'clientec@example.com',
            phone: '33333333333',
            document: '33333333333',
            documentType: DocumentType.CPF,
            status: ClientStatus.BLOCKED,
          },
        ],
      });
    });

    it('should return paginated clients', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.total).toBe(3);
      expect(response.body.page).toBe(1);
      expect(response.body.pageSize).toBe(10);
    });

    it('should filter by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ status: ClientStatus.ACTIVE })
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((c: any) => c.status === 'ACTIVE')).toBe(true);
    });

    it('should search by name', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ search: 'Cliente B' })
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Cliente B');
    });

    it('should sort by name ascending', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ sortBy: 'name', sortOrder: 'asc' })
        .expect(200);

      expect(response.body.data[0].name).toBe('Cliente A');
      expect(response.body.data[2].name).toBe('Cliente C Blocked');
    });

    it('should respect pagination limits', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 2 })
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.totalPages).toBe(2);
    });
  });

  describe('GET /api/clients/:id', () => {
    it('should return a single client', async () => {
      const client = await prisma.client.create({
        data: {
          name: 'Cliente Específico',
          email: 'especifico@example.com',
          phone: '11999999999',
          document: '44444444444',
          documentType: DocumentType.CPF,
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/api/clients/${client.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(client.id);
      expect(response.body.name).toBe('Cliente Específico');
    });

    it('should return 404 for non-existent client', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app.getHttpServer())
        .get(`/api/clients/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('PATCH /api/clients/:id', () => {
    it('should update client name', async () => {
      const client = await prisma.client.create({
        data: {
          name: 'Nome Original',
          email: 'original@example.com',
          phone: '11999999999',
          document: '55555555555',
          documentType: DocumentType.CPF,
        },
      });

      const response = await request(app.getHttpServer())
        .patch(`/api/clients/${client.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Nome Atualizado' })
        .expect(200);

      expect(response.body.name).toBe('Nome Atualizado');
      expect(response.body.email).toBe('original@example.com');
    });

    it('should return 409 when updating to duplicate email', async () => {
      const client1 = await prisma.client.create({
        data: {
          name: 'Cliente 1',
          email: 'email1@example.com',
          phone: '11111111111',
          document: '66666666666',
          documentType: DocumentType.CPF,
        },
      });

      const client2 = await prisma.client.create({
        data: {
          name: 'Cliente 2',
          email: 'email2@example.com',
          phone: '22222222222',
          document: '77777777777',
          documentType: DocumentType.CPF,
        },
      });

      const response = await request(app.getHttpServer())
        .patch(`/api/clients/${client2.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ email: 'email1@example.com' })
        .expect(409);

      expect(response.body.error.code).toBe('DB_UNIQUE_CONSTRAINT');
    });
  });

  describe('DELETE /api/clients/:id', () => {
    it('should delete a client', async () => {
      const client = await prisma.client.create({
        data: {
          name: 'Cliente para Deletar',
          email: 'deletar@example.com',
          phone: '11999999999',
          document: '88888888888',
          documentType: DocumentType.CPF,
        },
      });

      await request(app.getHttpServer())
        .delete(`/api/clients/${client.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verificar que foi deletado
      const deleted = await prisma.client.findUnique({
        where: { id: client.id },
      });

      expect(deleted).toBeNull();
    });

    it('should return 404 when deleting non-existent client', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app.getHttpServer())
        .delete(`/api/clients/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });
});
