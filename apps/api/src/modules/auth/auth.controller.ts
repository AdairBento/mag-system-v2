import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Ip,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { LoginDto, RegisterDto } from '@mag-system/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login de usuário' })
  @ApiBody({ type: LoginDto })
  login(
    @Body() loginDto: LoginDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authService.login(loginDto, ipAddress, userAgent);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({
    summary: 'Renovar access token',
    description:
      'Usa um refresh token válido para gerar um novo access token. O refresh token permanece válido por 30 dias.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          description: 'Refresh token obtido no login',
          example: 'a1b2c3d4e5f6...',
        },
      },
      required: ['refreshToken'],
    },
  })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout de usuário',
    description:
      'Revoga o refresh token fornecido, invalidando a sessão. O access token continua válido até expirar (15 min).',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          description: 'Refresh token a ser revogado',
          example: 'a1b2c3d4e5f6...',
        },
      },
      required: ['refreshToken'],
    },
  })
  async logout(
    @Request() req,
    @Body('refreshToken') refreshToken: string,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ) {
    await this.authService.logout(
      req.user.sub,
      refreshToken,
      ipAddress,
      userAgent,
    );
    return { message: 'Logout realizado com sucesso' };
  }
}
