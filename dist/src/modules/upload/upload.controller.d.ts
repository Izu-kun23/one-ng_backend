import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadProfile(file: Express.Multer.File, user: any): Promise<{
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
    uploadVendorLogo(vendorId: number, file: Express.Multer.File, user: any): Promise<{
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
    uploadProductImages(productId: number, files: Express.Multer.File[], user: any): Promise<{
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
    deleteImage(imageId: number, user: any): Promise<{
        message: string;
    }>;
}
