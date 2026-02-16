import { Injectable} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Gera e armazena um novo refresh token
   */
  async generateRefreshToken(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<string> {
    const payload = { sub: userId, type: 'refresh' };
    const expiresIn = this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '30d');

    const token = this.jwtService.sign(payload, { expiresIn });

    // Calcula data de expiração
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 dias

    // Armazena sessão no banco
    await this.prisma.session.create({
      data: {
        userId,
        refreshToken: token,
        ipAddress,
        userAgent,
        expiresAt}});

    return token;
  }

  /**
   * Valida refresh token e retorna userId
   */
  async validateRefreshToken(token: string): Promise<{ userId: string } | null> {
    try {
      // Verifica JWT
      const payload = this.jwtService.verify(token);

      // Busca sessão no banco
      const session = await this.prisma.session.findUnique({
        where: { refreshToken: token }});

      if (!session) {
        return null;
      }

      // Verifica expiração
      if (session.expiresAt < new Date()) {
        await this.revokeRefreshToken(token);
        return null;
      }

      return { userId: payload.sub };
    } catch (error) {
      return null;
    }
  }

  /**
   * Revoga refresh token (logout)
   */
  async revokeRefreshToken(token: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { refreshToken: token }});
  }

  /**
   * Revoga todas as sessões do usuário
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { userId }});
  }

  /**
   * Limpa sessões expiradas (job agendado)
   */
  async cleanExpiredSessions(): Promise<number> {
    const result = await this.prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()}}});

    return result.count;
  }
}

