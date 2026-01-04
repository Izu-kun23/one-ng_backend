import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UploadProductImageDto } from './dto/upload-product-image.dto';
import { UploadMultipleProductImagesDto } from './dto/upload-multiple-product-images.dto';
export declare class ProductsController {
    private readonly productsService;
    private readonly logger;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto, user: any): Promise<{
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
    update(id: number, updateProductDto: UpdateProductDto, user: any): Promise<{
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
    remove(id: number, user: any): Promise<{
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vendorId: number;
        price: number;
        stock: number;
    }>;
    uploadImage(productId: number, uploaded: {
        file?: Express.Multer.File[];
        image?: Express.Multer.File[];
        files?: Express.Multer.File[];
    }, uploadDto: UploadProductImageDto, user: any): Promise<{
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
    uploadMultipleImages(productId: number, uploaded: {
        files?: Express.Multer.File[];
        image?: Express.Multer.File[];
        images?: Express.Multer.File[];
    }, uploadDto: UploadMultipleProductImagesDto, user: any): Promise<any[]>;
    setPrimaryImage(imageId: number, user: any): Promise<{
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
    removeImage(imageId: number, user: any): Promise<{
        message: string;
    }>;
}
