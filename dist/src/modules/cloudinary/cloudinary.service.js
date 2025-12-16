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
            cloudinary_1.v2.config(cloudinaryUrl);
            this.configured = true;
        }
        else {
            const cloudName = this.configService.get('CLOUDINARY_CLOUD_NAME');
            const apiKey = this.configService.get('CLOUDINARY_API_KEY');
            const apiSecret = this.configService.get('CLOUDINARY_API_SECRET');
            if (cloudName && apiKey && apiSecret) {
                cloudinary_1.v2.config({
                    cloud_name: cloudName,
                    api_key: apiKey,
                    api_secret: apiSecret,
                });
                this.configured = true;
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
        return new Promise((resolve, reject) => {
            const uploadOptions = {
                resource_type: 'image',
                folder: folder || 'vendor-marketplace',
            };
            cloudinary_1.v2.uploader
                .upload_stream(uploadOptions, (error, result) => {
                if (error) {
                    reject(error);
                }
                else if (result) {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                }
                else {
                    reject(new Error('Upload failed'));
                }
            })
                .end(file.buffer);
        });
    }
    async deleteImage(publicId) {
        this.assertConfigured();
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
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
        const uploadPromises = files.map((file) => this.uploadImage(file, folder));
        return Promise.all(uploadPromises);
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = CloudinaryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map