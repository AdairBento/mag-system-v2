import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
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
  let prismaService: PrismaService;
  let refreshTokenService: RefreshTokenService;
  let auditService: AuditService;
  let progressiveLockService: ProgressiveLockService;

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

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockRefreshTokenService = {
    generateRefreshToken: jest.fn(),
    validateRefreshToken: jest.fn(),
    revokeRefreshToken: jest.fn(),
  };

  const mockAuditService = {
    logLogin: jest.fn(),
    logLogout: jest.fn(),
    logLoginFailed: jest.fn(),
  };

  const mockProgressiveLockService = {
    isLocked: jest.fn(),
    recordFailedAttempt: jest.fn(),
    resetFailedAttempts: jest.fn(),
    getRemainingLockTime: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: RefreshTokenService, useValue: mockRefreshTokenService },
        { provide: AuditService, useValue: mockAuditService },
        { provide: ProgressiveLockService, useValue: mockProgressiveLockService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    refreshTokenService = module.get<RefreshTokenService>(RefreshTokenService);
    auditService = module.get<AuditService>(AuditService);
    progressiveLockService = module.get<ProgressiveLockService>(ProgressiveLockService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'OPERATOR' as const,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('token');

      const result = await service.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          password: 'hashedPassword',
          name: registerDto.name,
          role: registerDto.role,
        },
      });
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe(mockUser.email);
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockProgressiveLockService.isLocked.mockResolvedValue(false);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockProgressiveLockService.resetFailedAttempts.mockResolvedValue(undefined);
      mockPrismaService.user.update.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('access-token');
      mockRefreshTokenService.generateRefreshToken.mockResolvedValue('refresh-token');
      mockAuditService.logLogin.mockResolvedValue(undefined);

      const result = await service.login(loginDto, '127.0.0.1', 'test-agent');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(progressiveLockService.isLocked).toHaveBeenCalledWith(mockUser.id);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(progressiveLockService.resetFailedAttempts).toHaveBeenCalledWith(mockUser.id);
      expect(auditService.logLogin).toHaveBeenCalledWith(mockUser.id, '127.0.0.1', 'test-agent');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const loginDto = {
        email: 'notfound@example.com',
        password: 'password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockAuditService.logLoginFailed.mockResolvedValue(undefined);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(auditService.logLoginFailed).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if account is locked', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockProgressiveLockService.isLocked.mockResolvedValue(true);
      mockProgressiveLockService.getRemainingLockTime.mockResolvedValue(5);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Conta bloqueada');
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockProgressiveLockService.isLocked.mockResolvedValue(false);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      mockProgressiveLockService.recordFailedAttempt.mockResolvedValue({
        locked: false,
        lockMinutes: 0,
        attempts: 1,
      });
      mockAuditService.logLoginFailed.mockResolvedValue(undefined);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(progressiveLockService.recordFailedAttempt).toHaveBeenCalledWith(
        mockUser.id,
        undefined,
      );
      expect(auditService.logLoginFailed).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should logout and revoke refresh token', async () => {
      const userId = '123';
      const refreshToken = 'refresh-token';

      mockRefreshTokenService.revokeRefreshToken.mockResolvedValue(undefined);
      mockAuditService.logLogout.mockResolvedValue(undefined);

      await service.logout(userId, refreshToken, '127.0.0.1', 'test-agent');

      expect(refreshTokenService.revokeRefreshToken).toHaveBeenCalledWith(refreshToken);
      expect(auditService.logLogout).toHaveBeenCalledWith(userId, '127.0.0.1', 'test-agent');
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token with valid refresh token', async () => {
      const refreshToken = 'valid-refresh-token';

      mockRefreshTokenService.validateRefreshToken.mockResolvedValue({
        userId: mockUser.id,
      });
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('new-access-token');

      const result = await service.refreshAccessToken(refreshToken);

      expect(refreshTokenService.validateRefreshToken).toHaveBeenCalledWith(refreshToken);
      expect(result).toHaveProperty('accessToken');
      expect(result.accessToken).toBe('new-access-token');
    });

    it('should throw UnauthorizedException with invalid refresh token', async () => {
      const refreshToken = 'invalid-refresh-token';

      mockRefreshTokenService.validateRefreshToken.mockResolvedValue(null);

      await expect(service.refreshAccessToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
