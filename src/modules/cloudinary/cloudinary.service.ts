import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private configured = false;

  constructor(private configService: ConfigService) {
    const cloudinaryUrl = this.configService.get<string>('CLOUDINARY_URL');
    if (cloudinaryUrl) {
      cloudinary.config(cloudinaryUrl);
      this.configured = true;
    } else {
      // Fallback: try to construct from individual vars if CLOUDINARY_URL not provided
      const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
      const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
      const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');
      if (cloudName && apiKey && apiSecret) {
        cloudinary.config({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
        });
        this.configured = true;
      } else {
        // Don't crash the whole API (and Swagger) if uploads aren't configured yet.
        // We'll throw only when an upload/delete operation is actually called.
        this.logger.warn(
          'Cloudinary not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET to enable uploads.',
        );
      }
    }
  }

  private assertConfigured() {
    if (!this.configured) {
      throw new ServiceUnavailableException(
        'Cloudinary is not configured on this server. Please set CLOUDINARY_URL (or individual credentials).',
      );
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<{ url: string; publicId: string }> {
    this.assertConfigured();
    return new Promise((resolve, reject) => {
      const uploadOptions: any = {
        resource_type: 'image',
        folder: folder || 'vendor-marketplace',
      };

      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          } else {
            reject(new Error('Upload failed'));
          }
        })
        .end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    this.assertConfigured();
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  getImageUrl(publicId: string, transformations?: any): string {
    this.assertConfigured();
    return cloudinary.url(publicId, {
      secure: true,
      ...transformations,
    });
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
    folder?: string,
  ): Promise<{ url: string; publicId: string }[]> {
    this.assertConfigured();
    const uploadPromises = files.map((file) => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  }
}

