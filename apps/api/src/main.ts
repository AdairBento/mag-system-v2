import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
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

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log('🚀 MAG System API rodando em: http://localhost:' + port);
  console.log('📚 Swagger docs: http://localhost:' + port + '/api/docs');
}

bootstrap();
