import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class UploadService {
    private prisma;
    private cloudinaryService;
    constructor(prisma: PrismaService, cloudinaryService: CloudinaryService);
    uploadProfileImage(userId: number, file: Express.Multer.File): Promise<{
        id: number;
        createdAt: Date;
        userId: number | null;
        vendorId: number | null;
        url: string;
        publicId: string;
        entityType: string;
        entityId: number;
        isPrimary: boolean;
        productId: number | null;
    }>;
    uploadVendorLogo(vendorId: number, userId: number, file: Express.Multer.File): Promise<{
        id: number;
        createdAt: Date;
        userId: number | null;
        vendorId: number | null;
        url: string;
        publicId: string;
        entityType: string;
        entityId: number;
        isPrimary: boolean;
        productId: number | null;
    }>;
    uploadProductImages(productId: number, userId: number, files: Express.Multer.File[]): Promise<{
        id: number;
        createdAt: Date;
        userId: number | null;
        vendorId: number | null;
        url: string;
        publicId: string;
        entityType: string;
        entityId: number;
        isPrimary: boolean;
        productId: number | null;
    }[]>;
    deleteImage(imageId: number, userId: number, isAdmin?: boolean): Promise<{
        message: string;
    }>;
}
