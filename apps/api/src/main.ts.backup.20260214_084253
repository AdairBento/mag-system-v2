import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as net from 'net';

/**
 * Verifica se uma porta está disponível
 */
function checkPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

async function bootstrap() {
  const port = Number(process.env.PORT) || 3001;

  // ✅ Verificar se porta está livre
  const isAvailable = await checkPortAvailable(port);
  if (!isAvailable) {
    console.error(`❌ Porta ${port} já está em uso!`);
    console.error(`💡 Execute: netstat -ano | findstr :${port}`);
    console.error(`💡 Ou rode: .\\scripts\\dev-doctor.ps1`);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('MAG System API')
    .setDescription('Sistema de Gestão de Locação de Veículos')
    .setVersion('2.0.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticação e autorização')
    .addTag('clients', 'Gestão de clientes')
    .addTag('drivers', 'Gestão de motoristas')
    .addTag('vehicles', 'Gestão de veículos')
    .addTag('rentals', 'Gestão de locações')
    .addTag('health', 'Health checks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);

  console.log('🚀 MAG System API rodando em: http://localhost:' + port);
  console.log('📚 Swagger docs: http://localhost:' + port + '/api/docs');

  // ✅ Graceful shutdown
  app.enableShutdownHooks();

  process.on('SIGTERM', async () => {
    console.log('⚠️  SIGTERM recebido, fechando servidor...');
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('⚠️  SIGINT (Ctrl+C) recebido, fechando servidor...');
    await app.close();
    process.exit(0);
  });
}

bootstrap();
