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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(buyerId, createOrderDto) {
        const vendor = await this.prisma.vendor.findUnique({
            where: { id: createOrderDto.sellerId },
        });
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found');
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
    async findAll(userId, role = 'all') {
        const where = {};
        if (role === 'buyer') {
            where.buyerId = userId;
        }
        else if (role === 'seller') {
            const vendor = await this.prisma.vendor.findUnique({
                where: { userId },
            });
            if (!vendor) {
                return [];
            }
            where.sellerId = vendor.id;
        }
        else {
            const vendor = await this.prisma.vendor.findUnique({
                where: { userId },
            });
            if (vendor) {
                where.OR = [
                    { buyerId: userId },
                    { sellerId: vendor.id },
                ];
            }
            else {
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
    async findOne(id, userId) {
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
            throw new common_1.NotFoundException('Order not found');
        }
        const vendor = await this.prisma.vendor.findUnique({
            where: { userId },
        });
        if (order.buyerId !== userId && (!vendor || order.sellerId !== vendor.id)) {
            throw new common_1.ForbiddenException('You do not have access to this order');
        }
        return order;
    }
    async updateStatus(id, userId, updateOrderStatusDto) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                vendor: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const vendor = await this.prisma.vendor.findUnique({
            where: { userId },
        });
        if (!vendor || order.sellerId !== vendor.id) {
            throw new common_1.ForbiddenException('Only the seller can update order status');
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map