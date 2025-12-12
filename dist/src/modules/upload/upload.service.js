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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let UploadService = class UploadService {
    prisma;
    cloudinaryService;
    constructor(prisma, cloudinaryService) {
        this.prisma = prisma;
        this.cloudinaryService = cloudinaryService;
    }
    async uploadProfileImage(userId, file) {
        const existingImage = await this.prisma.image.findUnique({
            where: { userId },
        });
        if (existingImage) {
            await this.cloudinaryService.deleteImage(existingImage.publicId);
            await this.prisma.image.delete({
                where: { id: existingImage.id },
            });
        }
        const { url, publicId } = await this.cloudinaryService.uploadImage(file, 'profiles');
        const image = await this.prisma.image.create({
            data: {
                url,
                publicId,
                entityType: 'USER',
                entityId: userId,
                userId,
            },
        });
        return image;
    }
    async uploadVendorLogo(vendorId, userId, file) {
        const vendor = await this.prisma.vendor.findUnique({
            where: { id: vendorId },
        });
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        if (vendor.userId !== userId) {
            throw new common_1.ForbiddenException('You can only upload logo for your own vendor profile');
        }
        const existingImage = await this.prisma.image.findUnique({
            where: { vendorId },
        });
        if (existingImage) {
            await this.cloudinaryService.deleteImage(existingImage.publicId);
            await this.prisma.image.delete({
                where: { id: existingImage.id },
            });
        }
        const { url, publicId } = await this.cloudinaryService.uploadImage(file, 'vendor-logos');
        const image = await this.prisma.image.create({
            data: {
                url,
                publicId,
                entityType: 'VENDOR',
                entityId: vendorId,
                vendorId,
            },
        });
        return image;
    }
    async uploadProductImages(productId, userId, files) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { vendor: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.vendor.userId !== userId) {
            throw new common_1.ForbiddenException('You can only upload images for your own products');
        }
        if (files.length === 0) {
            throw new common_1.BadRequestException('At least one image is required');
        }
        const uploadResults = await this.cloudinaryService.uploadMultipleImages(files, `products/${productId}`);
        const images = await Promise.all(uploadResults.map((result, index) => this.prisma.image.create({
            data: {
                url: result.url,
                publicId: result.publicId,
                entityType: 'PRODUCT',
                entityId: productId,
                productId,
                isPrimary: index === 0,
            },
        })));
        return images;
    }
    async deleteImage(imageId, userId, isAdmin = false) {
        const image = await this.prisma.image.findUnique({
            where: { id: imageId },
            include: {
                user: true,
                vendor: { include: { user: true } },
                product: { include: { vendor: { include: { user: true } } } },
            },
        });
        if (!image) {
            throw new common_1.NotFoundException('Image not found');
        }
        let hasPermission = false;
        if (isAdmin) {
            hasPermission = true;
        }
        else if (image.userId && image.userId === userId) {
            hasPermission = true;
        }
        else if (image.vendorId && image.vendor?.user?.id === userId) {
            hasPermission = true;
        }
        else if (image.productId && image.product?.vendor?.user?.id === userId) {
            hasPermission = true;
        }
        if (!hasPermission) {
            throw new common_1.ForbiddenException('You do not have permission to delete this image');
        }
        await this.cloudinaryService.deleteImage(image.publicId);
        await this.prisma.image.delete({
            where: { id: imageId },
        });
        return { message: 'Image deleted successfully' };
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService])
], UploadService);
//# sourceMappingURL=upload.service.js.map