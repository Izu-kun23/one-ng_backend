import { PrismaService } from '../../prisma/prisma.service';
import { AdminQueryDto } from './dto/admin-query.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { ApproveVendorDto } from './dto/approve-vendor.dto';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllUsers(query: AdminQueryDto): Promise<{
        data: {
            vendor: {
                id: number;
                businessName: string;
            } | null;
            email: string;
            phone: string;
            name: string;
            id: number;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
            profileImage: {
                id: number;
                createdAt: Date;
                userId: number | null;
                vendorId: number | null;
                url: string;
                publicId: string;
                entityType: string;
                entityId: number;
                isPrimary: boolean;
                productId: number | null;
            } | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUserById(id: number): Promise<{
        vendor: ({
            _count: {
                products: number;
                orders: number;
            };
            logo: {
                id: number;
                createdAt: Date;
                userId: number | null;
                vendorId: number | null;
                url: string;
                publicId: string;
                entityType: string;
                entityId: number;
                isPrimary: boolean;
                productId: number | null;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            businessName: string;
            interests: string | null;
            userId: number;
        }) | null;
        profileImage: {
            id: number;
            createdAt: Date;
            userId: number | null;
            vendorId: number | null;
            url: string;
            publicId: string;
            entityType: string;
            entityId: number;
            isPrimary: boolean;
            productId: number | null;
        } | null;
        _count: {
            sentMessages: number;
            receivedMessages: number;
        };
    } & {
        email: string;
        phone: string;
        password: string;
        name: string;
        id: number;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUser(id: number, updateData: any): Promise<{
        vendor: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            businessName: string;
            interests: string | null;
            userId: number;
        } | null;
        profileImage: {
            id: number;
            createdAt: Date;
            userId: number | null;
            vendorId: number | null;
            url: string;
            publicId: string;
            entityType: string;
            entityId: number;
            isPrimary: boolean;
            productId: number | null;
        } | null;
    } & {
        email: string;
        phone: string;
        password: string;
        name: string;
        id: number;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(id: number): Promise<{
        message: string;
    }>;
    banUser(id: number, banUserDto: BanUserDto): Promise<{
        message: string;
    }>;
    getAllVendors(query: AdminQueryDto): Promise<{
        data: ({
            user: {
                email: string;
                phone: string;
                name: string;
                id: number;
            };
            _count: {
                products: number;
                orders: number;
            };
            logo: {
                id: number;
                createdAt: Date;
                userId: number | null;
                vendorId: number | null;
                url: string;
                publicId: string;
                entityType: string;
                entityId: number;
                isPrimary: boolean;
                productId: number | null;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            businessName: string;
            interests: string | null;
            userId: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    approveVendor(id: number, approveVendorDto: ApproveVendorDto): Promise<{
        message: string;
    }>;
    getAllProducts(query: AdminQueryDto): Promise<{
        data: ({
            vendor: {
                user: {
                    email: string;
                    name: string;
                    id: number;
                };
            } & {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                businessName: string;
                interests: string | null;
                userId: number;
            };
            images: {
                id: number;
                createdAt: Date;
                userId: number | null;
                vendorId: number | null;
                url: string;
                publicId: string;
                entityType: string;
                entityId: number;
                isPrimary: boolean;
                productId: number | null;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            price: number;
            stock: number;
            vendorId: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    deleteProduct(id: number): Promise<{
        message: string;
    }>;
    getAllOrders(query: AdminQueryDto): Promise<{
        data: ({
            vendor: {
                user: {
                    email: string;
                    name: string;
                    id: number;
                };
            } & {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                businessName: string;
                interests: string | null;
                userId: number;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            total: number;
            buyerId: number;
            status: string;
            sellerId: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getAnalytics(): Promise<{
        overview: {
            totalUsers: number;
            totalVendors: number;
            totalProducts: number;
            totalOrders: number;
            totalMessages: number;
            totalRevenue: number;
        };
        usersByRole: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.UserGroupByOutputType, "role"[]> & {
            _count: number;
        })[];
        ordersByStatus: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.OrderGroupByOutputType, "status"[]> & {
            _count: number;
        })[];
    }>;
}
