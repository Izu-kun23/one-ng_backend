import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorQueryDto } from './dto/vendor-query.dto';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a vendor profile for a user
   */
  async create(userId: number, createVendorDto: CreateVendorDto) {
    // Check if user already has a vendor profile
    const existingVendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (existingVendor) {
      throw new ConflictException('User already has a vendor profile');
    }

    return this.prisma.vendor.create({
      data: {
        ...createVendorDto,
        userId,
      },
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
    });
  }

  /**
   * Get all vendors optionally filtered by interests
   */
  async findAll(query: VendorQueryDto) {
    const where: any = {};

    if (query.interests) {
      where.interests = {
        contains: query.interests,
        mode: 'insensitive',
      };
    }

    return this.prisma.vendor.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
  }

  /**
   * Get a vendor by vendor ID
   */
  async findOne(id: number) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        products: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return vendor;
  }

  /**
   * Update a vendor profile (only by owner)
   */
  async update(id: number, userId: number, updateVendorDto: UpdateVendorDto) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    if (vendor.userId !== userId) {
      throw new ForbiddenException('Unauthorized to update this vendor profile');
    }

    return this.prisma.vendor.update({
      where: { id },
      data: updateVendorDto,
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
    });
  }

  /**
   * Get a vendor profile by the logged-in user's ID
   */
  async findByUserId(userId: number) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        products: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    return vendor;
  }
}