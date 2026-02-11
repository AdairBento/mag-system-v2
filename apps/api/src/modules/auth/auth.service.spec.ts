import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '@/database/prisma.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { AuditService } from './services/audit.service';
import { ProgressiveLockService } from './services/progressive-lock.service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: '123',
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
    role: 'OPERATOR',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn().mockResolvedValue(mockUser),
              findUnique: jest.fn(),
              update: jest.fn().mockResolvedValue(mockUser),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
        {
          provide: RefreshTokenService,
          useValue: {
            generateRefreshToken: jest.fn().mockResolvedValue('refresh-token'),
            validateRefreshToken: jest.fn(),
            revokeRefreshToken: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: AuditService,
          useValue: {
            logLogin: jest.fn().mockResolvedValue(undefined),
            logLogout: jest.fn().mockResolvedValue(undefined),
            logLoginFailed: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: ProgressiveLockService,
          useValue: {
            isLocked: jest.fn().mockResolvedValue(false),
            recordFailedAttempt: jest.fn().mockResolvedValue({ locked: false, lockMinutes: 0, attempts: 1 }),
            resetFailedAttempts: jest.fn().mockResolvedValue(undefined),
            getRemainingLockTime: jest.fn().mockResolvedValue(5),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const result = await service.register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'OPERATOR',
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe(mockUser.email);
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const prismaService = service['prisma'];
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(
        { email: 'test@example.com', password: 'password123' },
        '127.0.0.1',
        'test-agent',
      );

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const prismaService = service['prisma'];
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        service.login({ email: 'notfound@example.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token', async () => {
      const refreshTokenService = service['refreshTokenService'];
      const prismaService = service['prisma'];

      refreshTokenService.validateRefreshToken = jest.fn().mockResolvedValue({ userId: mockUser.id });
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const result = await service.refreshAccessToken('valid-token');

      expect(result).toHaveProperty('accessToken');
    });
  });
});
