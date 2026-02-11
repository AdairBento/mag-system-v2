import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { AuditService } from './services/audit.service';
import { ProgressiveLockService } from './services/progressive-lock.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '@/database/prisma.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RefreshTokenService,
    AuditService,
    ProgressiveLockService,
    JwtStrategy,
    PrismaService,
  ],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
