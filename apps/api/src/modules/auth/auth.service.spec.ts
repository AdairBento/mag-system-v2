import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '@/database/prisma.service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService (simple)', () => {
  let service: AuthService;

  const mockUser = {
    id: '123',
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
    role: 'OPERATOR',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create user with hashed password and return tokens', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'plainPassword',
        name: 'Test User',
        role: 'OPERATOR',
      };

      (bcrypt.hash as unknown as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      // AuthService chama jwt.sign 2x: access + refresh
      mockJwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

      const result = await service.register(registerDto as any);

      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 10);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          password: 'hashedPassword',
          name: registerDto.name,
          role: registerDto.role,
        },
      });

      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);

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

    it('should default role to OPERATOR when role is missing', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'plainPassword',
        name: 'Test User',
      };

      (bcrypt.hash as unknown as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

      await service.register(registerDto as any);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          password: 'hashedPassword',
          name: registerDto.name,
          role: 'OPERATOR',
        },
      });
    });
  });

  describe('login', () => {
    it('should login and return tokens when credentials are valid', async () => {
      const loginDto = { email: 'test@example.com', password: 'plainPassword' };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as unknown as jest.Mock).mockResolvedValue(true);

      mockJwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

      const result = await service.login(loginDto as any);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);

      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);

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

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login({ email: 'x', password: 'y' } as any)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as unknown as jest.Mock).mockResolvedValue(false);

      await expect(service.login({ email: 'x', password: 'y' } as any)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
