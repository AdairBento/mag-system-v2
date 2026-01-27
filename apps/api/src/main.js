"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log('🚀 MAG System API rodando em: http://localhost:' + port);
    console.log('📚 Swagger docs: http://localhost:' + port + '/api/docs');
}
bootstrap();
//# sourceMappingURL=main.js.map