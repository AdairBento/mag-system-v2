import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenService } from './services/refresh-token.service';
import { AuditService } from './services/audit.service';
import { ProgressiveLockService } from './services/progressive-lock.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '15m' }, // Access token: 15 minutos
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshTokenService,
    AuditService,
    ProgressiveLockService,
  ],
  exports: [
    AuthService,
    RefreshTokenService,
    AuditService,
    ProgressiveLockService,
  ],
})
export class AuthModule {}
