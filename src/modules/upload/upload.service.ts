import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UploadService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async uploadProfileImage(userId: number, file: Express.Multer.File) {
    // Delete existing profile image if any
    const existingImage = await this.prisma.image.findUnique({
      where: { userId },
    });

    if (existingImage) {
      await this.cloudinaryService.deleteImage(existingImage.publicId);
      await this.prisma.image.delete({
        where: { id: existingImage.id },
      });
    }

    // Upload new image
    const { url, publicId } = await this.cloudinaryService.uploadImage(
      file,
      'profiles',
    );

    // Create image record
    const image = await this.prisma.image.create({
      data: {
        url,
        publicId,
        entityType: 'USER',
        entityId: userId,
        userId,
      },
    });

    return image;
  }

  async uploadVendorLogo(vendorId: number, userId: number, file: Express.Multer.File) {
    // Verify vendor ownership
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    if (vendor.userId !== userId) {
      throw new ForbiddenException('You can only upload logo for your own vendor profile');
    }

    // Delete existing logo if any
    const existingImage = await this.prisma.image.findUnique({
      where: { vendorId },
    });

    if (existingImage) {
      await this.cloudinaryService.deleteImage(existingImage.publicId);
      await this.prisma.image.delete({
        where: { id: existingImage.id },
      });
    }

    // Upload new image
    const { url, publicId } = await this.cloudinaryService.uploadImage(
      file,
      'vendor-logos',
    );

    // Create image record
    const image = await this.prisma.image.create({
      data: {
        url,
        publicId,
        entityType: 'VENDOR',
        entityId: vendorId,
        vendorId,
      },
    });

    return image;
  }

  async uploadProductImages(productId: number, userId: number, files: Express.Multer.File[]) {
    // Verify product ownership
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { vendor: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.vendor.userId !== userId) {
      throw new ForbiddenException('You can only upload images for your own products');
    }

    if (files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    // Upload images
    const uploadResults = await this.cloudinaryService.uploadMultipleImages(
      files,
      `products/${productId}`,
    );

    // Create image records
    const images = await Promise.all(
      uploadResults.map((result, index) =>
        this.prisma.image.create({
          data: {
            url: result.url,
            publicId: result.publicId,
            entityType: 'PRODUCT',
            entityId: productId,
            productId,
            isPrimary: index === 0, // First image is primary
          },
        }),
      ),
    );

    return images;
  }

  async deleteImage(imageId: number, userId: number, isAdmin: boolean = false) {
    const image = await this.prisma.image.findUnique({
      where: { id: imageId },
      include: {
        user: true,
        vendor: { include: { user: true } },
        product: { include: { vendor: { include: { user: true } } } },
      },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    // Check permissions
    let hasPermission = false;

    if (isAdmin) {
      hasPermission = true;
    } else if (image.userId && image.userId === userId) {
      hasPermission = true;
    } else if (image.vendorId && image.vendor?.user?.id === userId) {
      hasPermission = true;
    } else if (image.productId && image.product?.vendor?.user?.id === userId) {
      hasPermission = true;
    }

    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to delete this image');
    }

    // Delete from Cloudinary
    await this.cloudinaryService.deleteImage(image.publicId);

    // Delete from database
    await this.prisma.image.delete({
      where: { id: imageId },
    });

    return { message: 'Image deleted successfully' };
  }
}

