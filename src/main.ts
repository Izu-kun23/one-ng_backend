import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global prefix (applies to all controller routes)
  // Important: set this BEFORE generating Swagger docs so Swagger uses /api/* paths.
  app.setGlobalPrefix('api');

  // Swagger/OpenAPI configuration
  const config = new DocumentBuilder()
    .setTitle('Vendor-to-Vendor Marketplace API')
    .setDescription('Backend API for Vendor-to-Vendor Marketplace Application')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Vendor Marketplace API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customCss: '.swagger-ui .topbar { display: none }',
  });

  // Root route handler
  app.getHttpAdapter().get('/', (req, res) => {
    res.json({
      message: 'Vendor-to-Vendor Marketplace API',
      version: '1.0',
      documentation: '/api/docs',
      endpoints: {
        health: '/api',
        swagger: '/api/docs',
        auth: '/api/auth',
        users: '/api/users',
        vendors: '/api/vendors',
        products: '/api/products',
        orders: '/api/orders',
        messages: '/api/messages',
        upload: '/api/upload',
        admin: '/api/admin',
      },
    });
  });

  const port = Number(process.env.PORT) || 3000;
  const host = process.env.HOST || '0.0.0.0';

  await app.listen(port, host);

  // Logs are informational; Railway will provide the public URL.
  console.log(`Application is running on: http://${host}:${port}`);
  console.log(`Swagger documentation: http://${host}:${port}/api/docs`);
  console.log(`Swagger JSON: http://${host}:${port}/api/docs-json`);
  console.log(`API base URL: http://${host}:${port}/api`);
}

bootstrap();
