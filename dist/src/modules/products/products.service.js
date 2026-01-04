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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let ProductsService = class ProductsService {
    prisma;
    cloudinaryService;
    constructor(prisma, cloudinaryService) {
        this.prisma = prisma;
        this.cloudinaryService = cloudinaryService;
    }
    async create(userId, createProductDto) {
        const vendor = await this.prisma.vendor.findUnique({
            where: { userId },
        });
        if (!vendor) {
            throw new common_1.NotFoundException('User does not have a vendor profile');
        }
        return this.prisma.product.create({
            data: {
                title: createProductDto.title,
                description: createProductDto.description,
                price: createProductDto.price,
                stock: createProductDto.stock,
                vendorId: vendor.id,
            },
            include: {
                vendor: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                images: {
                    select: {
                        id: true,
                        url: true,
                        publicId: true,
                        isPrimary: true,
                        entityType: true,
                        entityId: true,
                    },
                    orderBy: {
                        isPrimary: 'desc',
                    },
                },
            },
        });
    }
    async findAll(query) {
        const where = {};
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    vendor: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                    images: {
                        select: {
                            id: true,
                            url: true,
                            publicId: true,
                            isPrimary: true,
                            entityType: true,
                            entityId: true,
                        },
                        orderBy: {
                            isPrimary: 'desc',
                        },
                    },
                },
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                vendor: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
                images: {
                    select: {
                        id: true,
                        url: true,
                        publicId: true,
                        isPrimary: true,
                        entityType: true,
                        entityId: true,
                    },
                    orderBy: {
                        isPrimary: 'desc',
                    },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async findByVendor(vendorId) {
        return this.prisma.product.findMany({
            where: { vendorId },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                vendor: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                images: {
                    select: {
                        id: true,
                        url: true,
                        publicId: true,
                        isPrimary: true,
                        entityType: true,
                        entityId: true,
                    },
                    orderBy: {
                        isPrimary: 'desc',
                    },
                },
            },
        });
    }
    async update(id, userId, updateProductDto) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                vendor: true,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.vendor.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own products');
        }
        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
            include: {
                vendor: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                images: {
                    select: {
                        id: true,
                        url: true,
                        publicId: true,
                        isPrimary: true,
                        entityType: true,
                        entityId: true,
                    },
                    orderBy: {
                        isPrimary: 'desc',
                    },
                },
            },
        });
    }
    async remove(id, userId) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                vendor: true,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.vendor.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own products');
        }
        return this.prisma.product.delete({
            where: { id },
        });
    }
    async uploadImage(productId, userId, file, isPrimary = false) {
        console.log('Upload request:', { productId, userId, isPrimary, file: file ? file.originalname : 'no file' });
        try {
            const product = await this.prisma.product.findUnique({
                where: { id: productId },
                include: { vendor: true },
            });
            if (!product) {
                console.log('Product not found:', productId);
                throw new common_1.NotFoundException('Product not found');
            }
            if (product.vendor.userId !== userId) {
                console.log('Permission denied: product userId', product.vendor.userId, 'request userId', userId);
                throw new common_1.ForbiddenException('You can only add images to your own products');
            }
            console.log('Product verified, uploading to Cloudinary...');
            let uploadResult;
            try {
                uploadResult = await this.cloudinaryService.uploadImage(file, `products/${productId}`);
                console.log('Cloudinary upload successful:', uploadResult);
            }
            catch (error) {
                console.error('Cloudinary upload error:', error);
                throw new common_1.BadRequestException('Failed to upload image to cloud storage: ' + error.message);
            }
            if (isPrimary) {
                console.log('Setting as primary, unsetting existing...');
                await this.prisma.image.updateMany({
                    where: {
                        productId,
                        isPrimary: true,
                    },
                    data: {
                        isPrimary: false,
                    },
                });
            }
            console.log('Creating image record...');
            const image = await this.prisma.image.create({
                data: {
                    url: uploadResult.url,
                    publicId: uploadResult.publicId,
                    entityType: 'product',
                    entityId: productId,
                    isPrimary,
                    productId,
                },
            });
            console.log('Image record created:', image);
            return image;
        }
        catch (error) {
            console.error('Upload image error:', error);
            throw error;
        }
    }
    async uploadMultipleImages(productId, userId, files, primaryIndex) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { vendor: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.vendor.userId !== userId) {
            throw new common_1.ForbiddenException('You can only add images to your own products');
        }
        const uploadedImages = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const isPrimary = primaryIndex === i;
            const uploadResult = await this.cloudinaryService.uploadImage(file, `products/${productId}`);
            if (isPrimary) {
                await this.prisma.image.updateMany({
                    where: {
                        productId,
                        isPrimary: true,
                    },
                    data: {
                        isPrimary: false,
                    },
                });
            }
            const image = await this.prisma.image.create({
                data: {
                    url: uploadResult.url,
                    publicId: uploadResult.publicId,
                    entityType: 'product',
                    entityId: productId,
                    isPrimary,
                    productId,
                },
            });
            uploadedImages.push(image);
        }
        return uploadedImages;
    }
    async removeImage(imageId, userId) {
        const image = await this.prisma.image.findUnique({
            where: { id: imageId },
            include: {
                product: {
                    include: {
                        vendor: true,
                    },
                },
            },
        });
        if (!image) {
            throw new common_1.NotFoundException('Image not found');
        }
        if (!image.product || image.product.vendor.userId !== userId) {
            throw new common_1.ForbiddenException('You can only remove images from your own products');
        }
        await this.cloudinaryService.deleteImage(image.publicId);
        await this.prisma.image.delete({
            where: { id: imageId },
        });
        return { message: 'Image deleted successfully' };
    }
    async setPrimaryImage(imageId, userId) {
        const image = await this.prisma.image.findUnique({
            where: { id: imageId },
            include: {
                product: {
                    include: {
                        vendor: true,
                    },
                },
            },
        });
        if (!image) {
            throw new common_1.NotFoundException('Image not found');
        }
        if (!image.product || image.product.vendor.userId !== userId) {
            throw new common_1.ForbiddenException('You can only manage images for your own products');
        }
        await this.prisma.image.updateMany({
            where: {
                productId: image.productId,
                isPrimary: true,
            },
            data: {
                isPrimary: false,
            },
        });
        const updatedImage = await this.prisma.image.update({
            where: { id: imageId },
            data: {
                isPrimary: true,
            },
        });
        return updatedImage;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService])
], ProductsService);
//# sourceMappingURL=products.service.js.map