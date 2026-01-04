import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
export declare class ProductsService {
    private prisma;
    private cloudinaryService;
    constructor(prisma: PrismaService, cloudinaryService: CloudinaryService);
    create(userId: number, createProductDto: CreateProductDto): Promise<{
        vendor: {
            user: {
                name: string;
                email: string;
                id: number;
            };
        } & {
            businessName: string;
            interests: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
        };
        images: {
            id: number;
            url: string;
            publicId: string;
            entityType: string;
            entityId: number;
            isPrimary: boolean;
        }[];
    } & {
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vendorId: number;
        price: number;
        stock: number;
    }>;
    findAll(query: ProductQueryDto): Promise<{
        data: ({
            vendor: {
                user: {
                    name: string;
                    email: string;
                    id: number;
                };
            } & {
                businessName: string;
                interests: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                userId: number;
            };
            images: {
                id: number;
                url: string;
                publicId: string;
                entityType: string;
                entityId: number;
                isPrimary: boolean;
            }[];
        } & {
            description: string | null;
            title: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            vendorId: number;
            price: number;
            stock: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        vendor: {
            user: {
                name: string;
                email: string;
                phone: string;
                id: number;
            };
        } & {
            businessName: string;
            interests: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
        };
        images: {
            id: number;
            url: string;
            publicId: string;
            entityType: string;
            entityId: number;
            isPrimary: boolean;
        }[];
    } & {
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vendorId: number;
        price: number;
        stock: number;
    }>;
    findByVendor(vendorId: number): Promise<({
        vendor: {
            user: {
                name: string;
                email: string;
                id: number;
            };
        } & {
            businessName: string;
            interests: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
        };
        images: {
            id: number;
            url: string;
            publicId: string;
            entityType: string;
            entityId: number;
            isPrimary: boolean;
        }[];
    } & {
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vendorId: number;
        price: number;
        stock: number;
    })[]>;
    update(id: number, userId: number, updateProductDto: UpdateProductDto): Promise<{
        vendor: {
            user: {
                name: string;
                email: string;
                id: number;
            };
        } & {
            businessName: string;
            interests: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
        };
        images: {
            id: number;
            url: string;
            publicId: string;
            entityType: string;
            entityId: number;
            isPrimary: boolean;
        }[];
    } & {
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vendorId: number;
        price: number;
        stock: number;
    }>;
    remove(id: number, userId: number): Promise<{
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vendorId: number;
        price: number;
        stock: number;
    }>;
    uploadImage(productId: number, userId: number, file: Express.Multer.File, isPrimary?: boolean): Promise<{
        id: number;
        createdAt: Date;
        userId: number | null;
        url: string;
        publicId: string;
        entityType: string;
        entityId: number;
        isPrimary: boolean;
        vendorId: number | null;
        productId: number | null;
    }>;
    uploadMultipleImages(productId: number, userId: number, files: Express.Multer.File[], primaryIndex?: number): Promise<any[]>;
    removeImage(imageId: number, userId: number): Promise<{
        message: string;
    }>;
    setPrimaryImage(imageId: number, userId: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number | null;
        url: string;
        publicId: string;
        entityType: string;
        entityId: number;
        isPrimary: boolean;
        vendorId: number | null;
        productId: number | null;
    }>;
}
