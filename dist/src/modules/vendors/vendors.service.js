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
exports.VendorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let VendorsService = class VendorsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createVendorDto) {
        const existingVendor = await this.prisma.vendor.findUnique({
            where: { userId },
        });
        if (existingVendor) {
            throw new common_1.ConflictException('User already has a vendor profile');
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
    async findAll(query) {
        const where = {};
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Vendor not found');
        }
        return vendor;
    }
    async update(id, userId, updateVendorDto) {
        const vendor = await this.prisma.vendor.findUnique({
            where: { id },
        });
        if (!vendor) {
            throw new common_1.NotFoundException('Vendor not found');
        }
        if (vendor.userId !== userId) {
            throw new common_1.ForbiddenException('Unauthorized to update this vendor profile');
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
};
exports.VendorsService = VendorsService;
exports.VendorsService = VendorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VendorsService);
//# sourceMappingURL=vendors.service.js.map