import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(buyerId: number, createOrderDto: CreateOrderDto) {
    // Verify seller (vendor) exists
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: createOrderDto.sellerId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return this.prisma.order.create({
      data: {
        total: createOrderDto.total,
        buyerId,
        sellerId: createOrderDto.sellerId,
        status: 'pending',
      },
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
      },
    });
  }

  async findAll(userId: number, role: 'buyer' | 'seller' | 'all' = 'all') {
    const where: any = {};

    if (role === 'buyer') {
      where.buyerId = userId;
    } else if (role === 'seller') {
      // Get user's vendor ID
      const vendor = await this.prisma.vendor.findUnique({
        where: { userId },
      });

      if (!vendor) {
        return [];
      }

      where.sellerId = vendor.id;
    } else {
      // Get user's vendor ID if exists
      const vendor = await this.prisma.vendor.findUnique({
        where: { userId },
      });

      if (vendor) {
        where.OR = [
          { buyerId: userId },
          { sellerId: vendor.id },
        ];
      } else {
        where.buyerId = userId;
      }
    }

    return this.prisma.order.findMany({
      where,
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
                phone: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: number, userId: number) {
    const order = await this.prisma.order.findUnique({
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
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Verify user is buyer or seller
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (order.buyerId !== userId && (!vendor || order.sellerId !== vendor.id)) {
      throw new ForbiddenException('You do not have access to this order');
    }

    return order;
  }

  async updateStatus(id: number, userId: number, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        vendor: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Only seller can update order status
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor || order.sellerId !== vendor.id) {
      throw new ForbiddenException('Only the seller can update order status');
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: updateOrderStatusDto.status,
      },
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
      },
    });
  }
}

