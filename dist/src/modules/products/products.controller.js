"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ProductsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const product_query_dto_1 = require("./dto/product-query.dto");
const upload_product_image_dto_1 = require("./dto/upload-product-image.dto");
const upload_multiple_product_images_dto_1 = require("./dto/upload-multiple-product-images.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let ProductsController = ProductsController_1 = class ProductsController {
    productsService;
    logger = new common_1.Logger(ProductsController_1.name);
    constructor(productsService) {
        this.productsService = productsService;
    }
    async create(createProductDto, user) {
        try {
            this.logger.log('Creating product with DTO:', createProductDto);
            const result = await this.productsService.create(user.id, createProductDto);
            this.logger.log('Product created successfully:', result?.id);
            return result;
        }
        catch (error) {
            this.logger.error('Product creation failed:', error.response?.data || error.message);
            throw error;
        }
    }
    async findAll(query) {
        return this.productsService.findAll(query);
    }
    async findOne(id) {
        return this.productsService.findOne(id);
    }
    async findByVendor(vendorId) {
        return this.productsService.findByVendor(vendorId);
    }
    async update(id, updateProductDto, user) {
        try {
            this.logger.log('Updating product with DTO:', updateProductDto);
            const result = await this.productsService.update(id, user.id, updateProductDto);
            return result;
        }
        catch (error) {
            this.logger.error('Product update failed:', error.response?.data || error.message);
            throw error;
        }
    }
    async remove(id, user) {
        return this.productsService.remove(id, user.id);
    }
    async uploadImage(productId, uploaded, uploadDto, user) {
        const file = uploaded?.file?.[0] ?? uploaded?.image?.[0] ?? uploaded?.files?.[0];
        if (!file) {
            throw new common_1.BadRequestException('File is required (use multipart field "file" or "image")');
        }
        return this.productsService.uploadImage(productId, user.id, file, uploadDto.isPrimary);
    }
    async uploadMultipleImages(productId, uploaded, uploadDto, user) {
        const files = uploaded?.files ?? uploaded?.images ?? uploaded?.image ?? [];
        if (!files.length) {
            throw new common_1.BadRequestException('At least one file is required (use multipart field "files", "images", or "image")');
        }
        return this.productsService.uploadMultipleImages(productId, user.id, files, uploadDto.primaryIndex);
    }
    async setPrimaryImage(imageId, user) {
        return this.productsService.setPrimaryImage(imageId, user.id);
    }
    async removeImage(imageId, user) {
        return this.productsService.removeImage(imageId, user.id);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new product (vendor only)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Product created successfully',
        example: {
            id: 1,
            title: 'iPhone 15 Pro',
            description: 'Latest iPhone with advanced features',
            price: 999.99,
            stock: 50,
            vendorId: 1,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
            vendor: {
                id: 1,
                businessName: 'Tech Store',
                userId: 1,
                user: {
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com',
                },
            },
            images: [],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Vendor not found',
        example: {
            statusCode: 404,
            message: 'User does not have a vendor profile',
            error: 'Not Found',
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all products with search and pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Search term' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Products retrieved successfully',
        example: {
            data: [
                {
                    id: 1,
                    title: 'iPhone 15 Pro',
                    description: 'Latest iPhone with advanced features',
                    price: 999.99,
                    stock: 50,
                    vendorId: 1,
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    images: [
                        {
                            id: 1,
                            url: 'https://res.cloudinary.com/example/image/upload/v1/products/1/image1.jpg',
                            publicId: 'products/1/image1',
                            isPrimary: true,
                            entityType: 'product',
                            entityId: 1,
                        },
                    ],
                },
            ],
            meta: {
                total: 100,
                page: 1,
                limit: 10,
                totalPages: 10,
            },
        },
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_query_dto_1.ProductQueryDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product details by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Product retrieved successfully',
        example: {
            id: 1,
            title: 'iPhone 15 Pro',
            description: 'Latest iPhone with advanced features',
            price: 999.99,
            stock: 50,
            vendorId: 1,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
            vendor: {
                id: 1,
                businessName: 'Tech Store',
                userId: 1,
            },
            images: [
                {
                    id: 1,
                    url: 'https://res.cloudinary.com/example/image/upload/v1/products/1/image1.jpg',
                    publicId: 'products/1/image1',
                    isPrimary: true,
                },
            ],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Product not found',
        example: {
            statusCode: 404,
            message: 'Product not found',
            error: 'Not Found',
        },
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('vendor/:vendorId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all products by vendor ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Products retrieved successfully' }),
    __param(0, (0, common_1.Param)('vendorId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findByVendor", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update product (owner only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not product owner' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_product_dto_1.UpdateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete product (owner only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not product owner' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/images'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'file', maxCount: 1 },
        { name: 'image', maxCount: 1 },
        { name: 'files', maxCount: 1 },
    ])),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a single image to a product (owner only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Image uploaded successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not product owner' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, upload_product_image_dto_1.UploadProductImageDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)(':id/images/multiple'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'files', maxCount: 10 },
        { name: 'image', maxCount: 10 },
        { name: 'images', maxCount: 10 },
    ])),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload multiple images to a product (owner only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Images uploaded successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not product owner' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, upload_multiple_product_images_dto_1.UploadMultipleProductImagesDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "uploadMultipleImages", null);
__decorate([
    (0, common_1.Patch)('images/:imageId/primary'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Set an image as primary (owner only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Primary image updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not product owner' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Image not found' }),
    __param(0, (0, common_1.Param)('imageId', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "setPrimaryImage", null);
__decorate([
    (0, common_1.Delete)('images/:imageId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a product image (owner only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Image deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - not product owner' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Image not found' }),
    __param(0, (0, common_1.Param)('imageId', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "removeImage", null);
exports.ProductsController = ProductsController = ProductsController_1 = __decorate([
    (0, swagger_1.ApiTags)('products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map