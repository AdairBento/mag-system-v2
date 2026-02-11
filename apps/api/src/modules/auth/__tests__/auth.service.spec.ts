import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PrismaService } from '@/database/prisma.service';
import { RefreshTokenService } from '../services/refresh-token.service';
import { AuditService } from '../services/audit.service';
import { ProgressiveLockService } from '../services/progressive-lock.service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let refreshTokenService: RefreshTokenService;
  let auditService: AuditService;
  let progressiveLockService: ProgressiveLockService;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: '$2a$10$hashedPassword',
    name: 'Test User',
    role: 'OPERATOR' as const,
    status: 'ACTIVE' as const,
    failedLoginAttempts: 0,
    lockedUntil: null,
    lastLoginAt: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
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
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        JWT_SECRET: 'test-secret-key',
        JWT_EXPIRES_IN: '15m',
        JWT_REFRESH_EXPIRES_IN: '7d',
      };
      return config[key];
    }),
  };

  const mockRefreshTokenService = {
    generateRefreshToken: jest.fn(),
    validateRefreshToken: jest.fn(),
    revokeRefreshToken: jest.fn(),
    revokeAllUserTokens: jest.fn(),
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
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    refreshTokenService = module.get<RefreshTokenService>(RefreshTokenService);
    auditService = module.get<AuditService>(AuditService);
    progressiveLockService = module.get<ProgressiveLockService>(ProgressiveLockService);
  });

  describe('Service Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have all dependencies injected', () => {
      expect(prismaService).toBeDefined();
      expect(jwtService).toBeDefined();
      expect(configService).toBeDefined();
      expect(refreshTokenService).toBeDefined();
      expect(auditService).toBeDefined();
      expect(progressiveLockService).toBeDefined();
    });
  });

  describe('register', () => {
    const registerDto = {
      email: 'newuser@example.com',
      password: 'StrongPass123!',
      name: 'New User',
      role: 'OPERATOR' as const,
    };

    it('should successfully register a new user', async () => {
      const hashedPassword = '$2a$10$hashedNewPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.create.mockResolvedValue({ ...mockUser, ...registerDto });
      mockJwtService.sign.mockReturnValue('access-token-123');
      mockRefreshTokenService.generateRefreshToken.mockResolvedValue('refresh-token-123');

      const result = await service.register(registerDto, '192.168.1.1', 'Mozilla/5.0');

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          password: hashedPassword,
          name: registerDto.name,
          role: registerDto.role,
        },
      });
      expect(mockRefreshTokenService.generateRefreshToken).toHaveBeenCalled();
      expect(mockAuditService.logRegister).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
    });

    it('should use default OPERATOR role when not specified', async () => {
      const dtoWithoutRole = { ...registerDto };
      delete (dtoWithoutRole as any).role;

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('token');
      mockRefreshTokenService.generateRefreshToken.mockResolvedValue('refresh');

      await service.register(dtoWithoutRole, '127.0.0.1', 'agent');

      expect(mockPrismaService.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            role: 'OPERATOR',
          }),
        })
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    it('should successfully login with valid credentials', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockProgressiveLockService.checkLockBeforeLogin.mockResolvedValue(undefined);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockProgressiveLockService.resetFailedAttempts.mockResolvedValue(undefined);
      mockJwtService.sign.mockReturnValue('access-token-456');
      mockRefreshTokenService.generateRefreshToken.mockResolvedValue('refresh-token-456');

      const result = await service.login(loginDto, '192.168.1.1', 'Mozilla/5.0');

      expect(mockProgressiveLockService.checkLockBeforeLogin).toHaveBeenCalledWith(mockUser);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(mockProgressiveLockService.resetFailedAttempts).toHaveBeenCalledWith(mockUser.id);
      expect(mockAuditService.logLogin).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto, '192.168.1.1', 'Mozilla/5.0')).rejects.toThrow(
        UnauthorizedException
      );

      expect(mockAuditService.logLoginFailed).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockProgressiveLockService.checkLockBeforeLogin.mockResolvedValue(undefined);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      mockProgressiveLockService.recordFailedAttempt.mockResolvedValue({
        locked: false,
        lockMinutes: 0,
        attempts: 1,
      });

      await expect(service.login(loginDto, '192.168.1.1', 'Mozilla/5.0')).rejects.toThrow(
        UnauthorizedException
      );

      expect(mockProgressiveLockService.recordFailedAttempt).toHaveBeenCalledWith(mockUser.id);
      expect(mockAuditService.logLoginFailed).toHaveBeenCalled();
    });

    it('should lock account after multiple failed attempts', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockProgressiveLockService.checkLockBeforeLogin.mockResolvedValue(undefined);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      mockProgressiveLockService.recordFailedAttempt.mockResolvedValue({
        locked: true,
        lockMinutes: 15,
        attempts: 5,
      });

      await expect(service.login(loginDto, '192.168.1.1', 'Mozilla/5.0')).rejects.toThrow(
        UnauthorizedException
      );

      expect(mockProgressiveLockService.recordFailedAttempt).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should successfully logout and revoke refresh token', async () => {
      mockRefreshTokenService.revokeRefreshToken.mockResolvedValue(undefined);

      await service.logout('user-123', 'refresh-token-789', '192.168.1.1', 'Mozilla/5.0');

      expect(mockRefreshTokenService.revokeRefreshToken).toHaveBeenCalledWith('refresh-token-789');
      expect(mockAuditService.logLogout).toHaveBeenCalledWith(
        'user-123',
        '192.168.1.1',
        'Mozilla/5.0'
      );
    });
  });

  describe('refreshAccessToken', () => {
    it('should successfully refresh access token', async () => {
      mockRefreshTokenService.validateRefreshToken.mockResolvedValue({
        userId: mockUser.id,
      });
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('new-access-token');

      const result = await service.refreshAccessToken(
        'refresh-token-789',
        '192.168.1.1',
        'Mozilla/5.0'
      );

      expect(mockRefreshTokenService.validateRefreshToken).toHaveBeenCalledWith(
        'refresh-token-789'
      );
      expect(mockAuditService.logRefreshToken).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken', 'new-access-token');
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      mockRefreshTokenService.validateRefreshToken.mockResolvedValue(null);

      await expect(
        service.refreshAccessToken('invalid-token', '192.168.1.1', 'Mozilla/5.0')
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockRefreshTokenService.validateRefreshToken.mockResolvedValue({
        userId: 'nonexistent-user',
      });
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.refreshAccessToken('refresh-token-789', '192.168.1.1', 'Mozilla/5.0')
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
