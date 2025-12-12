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
  // Setup Swagger before global prefix to avoid path conflicts
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Vendor Marketplace API Docs',
  });

  // Global prefix (applies to all controller routes)
  app.setGlobalPrefix('api');

  // Root route handler (before global prefix applies)
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

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
