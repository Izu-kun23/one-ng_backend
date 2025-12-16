"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: true,
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Vendor-to-Vendor Marketplace API')
        .setDescription('Backend API for Vendor-to-Vendor Marketplace Application')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        customSiteTitle: 'Vendor Marketplace API Docs',
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        },
        customCss: '.swagger-ui .topbar { display: none }',
    });
    app.setGlobalPrefix('api');
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
    console.log(`Application is running on: http://${host}:${port}`);
    console.log(`Swagger documentation: http://${host}:${port}/api/docs`);
    console.log(`Swagger JSON: http://${host}:${port}/api/docs-json`);
    console.log(`API base URL: http://${host}:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map