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

const mockUser = {
  id: '123',
  email: 'test@example.com',
  password: 'hashedPassword',
  name: 'Test User',
  role: 'OPERATOR' as const,
  status: 'ACTIVE' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLoginAt: null,
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
    const config = {
      JWT_SECRET: 'test-secret',
      JWT_EXPIRES_IN: '15m',
    };
    return config[key];
  }),
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

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: jest.Mocked<PrismaService>;
  let jwtService: jest.Mocked<JwtService>;
  let refreshTokenService: jest.Mocked<RefreshTokenService>;
  let auditService: jest.Mocked<AuditService>;
  let progressiveLockService: jest.Mocked<ProgressiveLockService>;

  beforeEach(async () => {
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
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
    refreshTokenService = module.get(RefreshTokenService);
    auditService = module.get(AuditService);
    progressiveLockService = module.get(ProgressiveLockService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'OPERATOR' as const,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('access-token');
      mockRefreshTokenService.generateRefreshToken.mockResolvedValue('refresh-token');

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
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        },
      });
    });
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
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
      expect(auditService.logLogin).toHaveBeenCalledWith(mockUser.id, '127.0.0.1', 'test-agent');
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        },
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const loginDto = {
        email: 'notfound@example.com',
        password: 'password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockAuditService.logLoginFailed.mockResolvedValue(undefined);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(auditService.logLoginFailed).toHaveBeenCalledWith(
        loginDto.email,
        'Usuário não encontrado',
        undefined,
        undefined,
      );
    });

    it('should throw UnauthorizedException when account is locked', async () => {
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

    it('should throw UnauthorizedException with invalid password', async () => {
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
    });
  });

  describe('logout', () => {
    it('should successfully logout user', async () => {
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
    it('should successfully refresh access token', async () => {
      const refreshToken = 'valid-refresh-token';

      mockRefreshTokenService.validateRefreshToken.mockResolvedValue({
        userId: mockUser.id,
      } as any);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('new-access-token');

      const result = await service.refreshAccessToken(refreshToken);

      expect(refreshTokenService.validateRefreshToken).toHaveBeenCalledWith(refreshToken);
      expect(result).toEqual({ accessToken: 'new-access-token' });
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
