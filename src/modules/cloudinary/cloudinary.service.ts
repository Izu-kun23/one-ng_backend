import { Injectable, Logger, ServiceUnavailableException, BadRequestException } from '@nestjs/common';
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
      try {
        cloudinary.config(cloudinaryUrl);
        this.configured = true;
        this.logger.log('Cloudinary configured using CLOUDINARY_URL');
      } catch (error) {
        this.logger.error('Failed to configure Cloudinary with CLOUDINARY_URL:', error.message);
      }
    }
    
    // Fallback: try to construct from individual vars if CLOUDINARY_URL not provided or failed
    if (!this.configured) {
      const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
      const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
      const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');
      if (cloudName && apiKey && apiSecret) {
        try {
          cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
          });
          this.configured = true;
          this.logger.log('Cloudinary configured using individual credentials');
        } catch (error) {
          this.logger.error('Failed to configure Cloudinary with individual credentials:', error.message);
        }
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
    try {
      // Validate file
      if (!file || file.size === 0) {
        throw new BadRequestException('Invalid file provided');
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new BadRequestException('File size must be less than 10MB');
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException('Only JPEG, PNG, GIF, and WebP images are allowed');
      }

      this.logger.log(`Uploading image: ${file.originalname}, size: ${file.size}, type: ${file.mimetype}`);

      // Convert buffer to base64 for Cloudinary
      const base64String = file.buffer.toString('base64');
      const dataUrl = `data:${file.mimetype};base64,${base64String}`;

      // Cloudinary upload with explicit options
      const result = await cloudinary.uploader.upload(dataUrl, {
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
    } catch (error) {
      this.logger.error('Cloudinary upload failed:', error.message);
      
      if (error.message.includes('Invalid file')) {
        throw error; // Re-throw validation errors
      }
      
      throw new BadRequestException('Image upload failed: ' + error.message);
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    this.assertConfigured();
    try {
      if (!publicId) {
        throw new BadRequestException('Public ID is required');
      }

      this.logger.log(`Deleting image: ${publicId}`);
      
      const result = await cloudinary.uploader.destroy(publicId);
      
      if (result.result === 'ok') {
        this.logger.log(`Image deleted successfully: ${publicId}`);
        return;
      } else {
        this.logger.warn(`Image deletion failed: ${publicId}, result: ${result.result}`);
        throw new BadRequestException('Image deletion failed');
      }
    } catch (error) {
      this.logger.error('Cloudinary delete failed:', error.message);
      throw new BadRequestException('Image deletion failed: ' + error.message);
    }
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
    
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one file is required');
    }

    if (files.length > 10) {
      throw new BadRequestException('Maximum 10 files allowed');
    }

    this.logger.log(`Uploading ${files.length} images to folder: ${folder || 'vendor-marketplace'}`);

    // Upload all images in parallel
    const uploadPromises = files.map((file) => this.uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);

    this.logger.log(`Successfully uploaded ${results.length} images`);
    return results;
  }
}
