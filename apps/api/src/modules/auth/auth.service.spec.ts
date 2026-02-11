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
    role: 'OPERATOR' as const,
    status: 'ACTIVE' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: string) => {
      const config: Record<string, string> = {
        JWT_SECRET: 'test-secret',
        JWT_EXPIRES_IN: '15m',
        JWT_REFRESH_EXPIRES_IN: '30d',
      };
      return config[key] || defaultValue;
    }),
  };

  const mockRefreshTokenService = {
    generateRefreshToken: jest.fn().mockResolvedValue('refresh-token'),
    validateRefreshToken: jest.fn(),
    revokeRefreshToken: jest.fn(),
  };

  const mockAuditService = {
    logLogin: jest.fn(),
    logLogout: jest.fn(),
    logLoginFailed: jest.fn(),
    logRegister: jest.fn(),
    logRefreshToken: jest.fn(),
  };

  const mockProgressiveLockService = {
    checkLockBeforeLogin: jest.fn(),
    recordFailedAttempt: jest.fn(),
    resetFailedAttempts: jest.fn(),
    isLocked: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: RefreshTokenService, useValue: mockRefreshTokenService },
        { provide: AuditService, useValue: mockAuditService },
        { provide: ProgressiveLockService, useValue: mockProgressiveLockService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create user and return tokens', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'plainPassword',
        name: 'Test User',
        role: 'OPERATOR' as const,
      };

      (bcrypt.hash as unknown as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockJwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await service.register(registerDto, '127.0.0.1', 'test-agent');

      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 10);
      expect(mockPrismaService.user.create).toHaveBeenCalled();
      expect(mockRefreshTokenService.generateRefreshToken).toHaveBeenCalledWith(
        mockUser.id,
        '127.0.0.1',
        'test-agent',
      );
      expect(mockAuditService.logRegister).toHaveBeenCalledWith(
        mockUser.id,
        '127.0.0.1',
        'test-agent',
      );

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe(mockUser.email);
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'plainPassword' };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as unknown as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');
      mockProgressiveLockService.checkLockBeforeLogin.mockResolvedValue(undefined);
      mockProgressiveLockService.resetFailedAttempts.mockResolvedValue(undefined);

      const result = await service.login(loginDto, '127.0.0.1', 'test-agent');

      expect(mockProgressiveLockService.checkLockBeforeLogin).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(mockProgressiveLockService.resetFailedAttempts).toHaveBeenCalled();
      expect(mockRefreshTokenService.generateRefreshToken).toHaveBeenCalled();
      expect(mockAuditService.logLogin).toHaveBeenCalled();

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw if user not found', async () => {
      const loginDto = { email: 'missing@example.com', password: 'x' };

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login(loginDto, '127.0.0.1', 'test-agent'),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockAuditService.logLoginFailed).toHaveBeenCalled();
    });

    it('should throw if password is invalid', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrong' };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as unknown as jest.Mock).mockResolvedValue(false);
      mockProgressiveLockService.checkLockBeforeLogin.mockResolvedValue(undefined);
      mockProgressiveLockService.recordFailedAttempt.mockResolvedValue({
        locked: false,
        lockMinutes: 0,
        attempts: 1,
      });

      await expect(
        service.login(loginDto, '127.0.0.1', 'test-agent'),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockProgressiveLockService.recordFailedAttempt).toHaveBeenCalled();
      expect(mockAuditService.logLoginFailed).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should revoke refresh token and log', async () => {
      await service.logout('user-id', 'refresh-token', '127.0.0.1', 'test-agent');

      expect(mockRefreshTokenService.revokeRefreshToken).toHaveBeenCalledWith(
        'refresh-token',
      );
      expect(mockAuditService.logLogout).toHaveBeenCalled();
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token', async () => {
      mockRefreshTokenService.validateRefreshToken.mockResolvedValue({
        userId: mockUser.id,
      });
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('new-access-token');

      const result = await service.refreshAccessToken(
        'refresh-token',
        '127.0.0.1',
        'test-agent',
      );

      expect(result).toHaveProperty('accessToken');
      expect(mockAuditService.logRefreshToken).toHaveBeenCalled();
    });

    it('should throw if refresh token is invalid', async () => {
      mockRefreshTokenService.validateRefreshToken.mockResolvedValue(null);

      await expect(
        service.refreshAccessToken('invalid-token', '127.0.0.1', 'test-agent'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
