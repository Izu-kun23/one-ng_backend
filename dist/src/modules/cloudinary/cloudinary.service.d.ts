import { ConfigService } from '@nestjs/config';
export declare class CloudinaryService {
    private configService;
    private readonly logger;
    private configured;
    constructor(configService: ConfigService);
    private assertConfigured;
    uploadImage(file: Express.Multer.File, folder?: string): Promise<{
        url: string;
        publicId: string;
    }>;
    deleteImage(publicId: string): Promise<void>;
    getImageUrl(publicId: string, transformations?: any): string;
    uploadMultipleImages(files: Express.Multer.File[], folder?: string): Promise<{
        url: string;
        publicId: string;
    }[]>;
}
