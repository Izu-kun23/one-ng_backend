import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(userId: number, createProductDto: CreateProductDto) {
    // Get user's vendor
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      throw new NotFoundException('User does not have a vendor profile');
    }

    return this.prisma.product.create({
      data: {
        ...createProductDto,
        vendorId: vendor.id,
      },
      include: {
        vendor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            publicId: true,
            isPrimary: true,
            entityType: true,
            entityId: true,
          },
          orderBy: {
            isPrimary: 'desc',
          },
        },
      },
    });
  }

  async findAll(query: ProductQueryDto) {
    const where: any = {};
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          vendor: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          images: {
            select: {
              id: true,
              url: true,
              publicId: true,
              isPrimary: true,
              entityType: true,
              entityId: true,
            },
            orderBy: {
              isPrimary: 'desc',
            },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        vendor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            publicId: true,
            isPrimary: true,
            entityType: true,
            entityId: true,
          },
          orderBy: {
            isPrimary: 'desc',
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findByVendor(vendorId: number) {
    return this.prisma.product.findMany({
      where: { vendorId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        vendor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            publicId: true,
            isPrimary: true,
            entityType: true,
            entityId: true,
          },
          orderBy: {
            isPrimary: 'desc',
          },
        },
      },
    });
  }

  async update(id: number, userId: number, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        vendor: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Verify user owns the vendor
    if (product.vendor.userId !== userId) {
      throw new ForbiddenException('You can only update your own products');
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        vendor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            publicId: true,
            isPrimary: true,
            entityType: true,
            entityId: true,
          },
          orderBy: {
            isPrimary: 'desc',
          },
        },
      },
    });
  }

  async remove(id: number, userId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        vendor: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Verify user owns the vendor
    if (product.vendor.userId !== userId) {
      throw new ForbiddenException('You can only delete your own products');
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }

  async uploadImage(productId: number, userId: number, file: Express.Multer.File, isPrimary = false) {
    console.log('Upload request:', { productId, userId, isPrimary, file: file ? file.originalname : 'no file' });
    
    try {
      // Verify product exists and user owns it
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        include: { vendor: true },
      });

      if (!product) {
        console.log('Product not found:', productId);
        throw new NotFoundException('Product not found');
      }

      if (product.vendor.userId !== userId) {
        console.log('Permission denied: product userId', product.vendor.userId, 'request userId', userId);
        throw new ForbiddenException('You can only add images to your own products');
      }

      console.log('Product verified, uploading to Cloudinary...');

      // Upload image to Cloudinary
      let uploadResult;
      try {
        uploadResult = await this.cloudinaryService.uploadImage(file, `products/${productId}`);
        console.log('Cloudinary upload successful:', uploadResult);
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new BadRequestException('Failed to upload image to cloud storage: ' + error.message);
      }

      // If setting as primary, unset existing primary images
      if (isPrimary) {
        console.log('Setting as primary, unsetting existing...');
        await this.prisma.image.updateMany({
          where: {
            productId,
            isPrimary: true,
          },
          data: {
            isPrimary: false,
          },
        });
      }

      console.log('Creating image record...');

      // Create image record
      const image = await this.prisma.image.create({
        data: {
          url: uploadResult.url,
          publicId: uploadResult.publicId,
          entityType: 'product',
          entityId: productId,
          isPrimary,
          productId,
        },
      });

      console.log('Image record created:', image);
      return image;
    } catch (error) {
      console.error('Upload image error:', error);
      throw error;
    }
  }

  async uploadMultipleImages(productId: number, userId: number, files: Express.Multer.File[], primaryIndex?: number) {
    // Verify product exists and user owns it
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { vendor: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.vendor.userId !== userId) {
      throw new ForbiddenException('You can only add images to your own products');
    }

    const uploadedImages: any[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isPrimary = primaryIndex === i;

      // Upload image to Cloudinary
      const uploadResult = await this.cloudinaryService.uploadImage(file, `products/${productId}`);

      // If setting as primary, unset existing primary images
      if (isPrimary) {
        await this.prisma.image.updateMany({
          where: {
            productId,
            isPrimary: true,
          },
          data: {
            isPrimary: false,
          },
        });
      }

      // Create image record
      const image = await this.prisma.image.create({
        data: {
          url: uploadResult.url,
          publicId: uploadResult.publicId,
          entityType: 'product',
          entityId: productId,
          isPrimary,
          productId,
        },
      });

      uploadedImages.push(image);
    }

    return uploadedImages;
  }

  async removeImage(imageId: number, userId: number) {
    // Get image with product and vendor info
    const image = await this.prisma.image.findUnique({
      where: { id: imageId },
      include: {
        product: {
          include: {
            vendor: true,
          },
        },
      },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    // Verify user owns the product
    if (!image.product || image.product.vendor.userId !== userId) {
      throw new ForbiddenException('You can only remove images from your own products');
    }

    // Delete from Cloudinary
    await this.cloudinaryService.deleteImage(image.publicId);

    // Delete from database
    await this.prisma.image.delete({
      where: { id: imageId },
    });

    return { message: 'Image deleted successfully' };
  }

  async setPrimaryImage(imageId: number, userId: number) {
    // Get image with product and vendor info
    const image = await this.prisma.image.findUnique({
      where: { id: imageId },
      include: {
        product: {
          include: {
            vendor: true,
          },
        },
      },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    // Verify user owns the product
    if (!image.product || image.product.vendor.userId !== userId) {
      throw new ForbiddenException('You can only manage images for your own products');
    }

    // Unset existing primary images for this product
    await this.prisma.image.updateMany({
      where: {
        productId: image.productId,
        isPrimary: true,
      },
      data: {
        isPrimary: false,
      },
    });

    // Set this image as primary
    const updatedImage = await this.prisma.image.update({
      where: { id: imageId },
      data: {
        isPrimary: true,
      },
    });

    return updatedImage;
  }
}

