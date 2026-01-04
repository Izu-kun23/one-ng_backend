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
var CloudinaryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
let CloudinaryService = CloudinaryService_1 = class CloudinaryService {
    configService;
    logger = new common_1.Logger(CloudinaryService_1.name);
    configured = false;
    constructor(configService) {
        this.configService = configService;
        const cloudinaryUrl = this.configService.get('CLOUDINARY_URL');
        if (cloudinaryUrl) {
            try {
                cloudinary_1.v2.config(cloudinaryUrl);
                this.configured = true;
                this.logger.log('Cloudinary configured using CLOUDINARY_URL');
            }
            catch (error) {
                this.logger.error('Failed to configure Cloudinary with CLOUDINARY_URL:', error.message);
            }
        }
        if (!this.configured) {
            const cloudName = this.configService.get('CLOUDINARY_CLOUD_NAME');
            const apiKey = this.configService.get('CLOUDINARY_API_KEY');
            const apiSecret = this.configService.get('CLOUDINARY_API_SECRET');
            if (cloudName && apiKey && apiSecret) {
                try {
                    cloudinary_1.v2.config({
                        cloud_name: cloudName,
                        api_key: apiKey,
                        api_secret: apiSecret,
                    });
                    this.configured = true;
                    this.logger.log('Cloudinary configured using individual credentials');
                }
                catch (error) {
                    this.logger.error('Failed to configure Cloudinary with individual credentials:', error.message);
                }
            }
            else {
                this.logger.warn('Cloudinary not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET to enable uploads.');
            }
        }
    }
    assertConfigured() {
        if (!this.configured) {
            throw new common_1.ServiceUnavailableException('Cloudinary is not configured on this server. Please set CLOUDINARY_URL (or individual credentials).');
        }
    }
    async uploadImage(file, folder) {
        this.assertConfigured();
        try {
            if (!file || file.size === 0) {
                throw new common_1.BadRequestException('Invalid file provided');
            }
            if (file.size > 10 * 1024 * 1024) {
                throw new common_1.BadRequestException('File size must be less than 10MB');
            }
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.mimetype)) {
                throw new common_1.BadRequestException('Only JPEG, PNG, GIF, and WebP images are allowed');
            }
            this.logger.log(`Uploading image: ${file.originalname}, size: ${file.size}, type: ${file.mimetype}`);
            const base64String = file.buffer.toString('base64');
            const dataUrl = `data:${file.mimetype};base64,${base64String}`;
            const result = await cloudinary_1.v2.uploader.upload(dataUrl, {
                folder: folder || 'vendor-marketplace',
                resource_type: 'auto',
                format: 'auto',
                quality: 'auto',
                fetch_format: 'auto',
            });
            this.logger.log(`Upload successful: ${result.public_id}`);
            return {
                url: result.secure_url,
                publicId: result.public_id,
            };
        }
        catch (error) {
            this.logger.error('Cloudinary upload failed:', error.message);
            if (error.message.includes('Invalid file')) {
                throw error;
            }
            throw new common_1.BadRequestException('Image upload failed: ' + error.message);
        }
    }
    async deleteImage(publicId) {
        this.assertConfigured();
        try {
            if (!publicId) {
                throw new common_1.BadRequestException('Public ID is required');
            }
            this.logger.log(`Deleting image: ${publicId}`);
            const result = await cloudinary_1.v2.uploader.destroy(publicId);
            if (result.result === 'ok') {
                this.logger.log(`Image deleted successfully: ${publicId}`);
                return;
            }
            else {
                this.logger.warn(`Image deletion failed: ${publicId}, result: ${result.result}`);
                throw new common_1.BadRequestException('Image deletion failed');
            }
        }
        catch (error) {
            this.logger.error('Cloudinary delete failed:', error.message);
            throw new common_1.BadRequestException('Image deletion failed: ' + error.message);
        }
    }
    getImageUrl(publicId, transformations) {
        this.assertConfigured();
        return cloudinary_1.v2.url(publicId, {
            secure: true,
            ...transformations,
        });
    }
    async uploadMultipleImages(files, folder) {
        this.assertConfigured();
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('At least one file is required');
        }
        if (files.length > 10) {
            throw new common_1.BadRequestException('Maximum 10 files allowed');
        }
        this.logger.log(`Uploading ${files.length} images to folder: ${folder || 'vendor-marketplace'}`);
        const uploadPromises = files.map((file) => this.uploadImage(file, folder));
        const results = await Promise.all(uploadPromises);
        this.logger.log(`Successfully uploaded ${results.length} images`);
        return results;
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = CloudinaryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map