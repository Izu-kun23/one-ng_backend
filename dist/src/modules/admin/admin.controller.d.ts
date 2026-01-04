import { AdminService } from './admin.service';
import { AdminQueryDto } from './dto/admin-query.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { ApproveVendorDto } from './dto/approve-vendor.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getAllUsers(query: AdminQueryDto): Promise<{
        data: {
            vendor: {
                businessName: string;
                id: number;
            } | null;
            name: string;
            email: string;
            phone: string;
            id: number;
            role: import("@prisma/client").$Enums.UserRole;
            createdAt: Date;
            updatedAt: Date;
            profileImage: {
                id: number;
                createdAt: Date;
                userId: number | null;
                url: string;
                publicId: string;
                entityType: string;
                entityId: number;
                isPrimary: boolean;
                vendorId: number | null;
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
                orders: number;
                products: number;
            };
            logo: {
                id: number;
                createdAt: Date;
                userId: number | null;
                url: string;
                publicId: string;
                entityType: string;
                entityId: number;
                isPrimary: boolean;
                vendorId: number | null;
                productId: number | null;
            } | null;
        } & {
            businessName: string;
            interests: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
        }) | null;
        profileImage: {
            id: number;
            createdAt: Date;
            userId: number | null;
            url: string;
            publicId: string;
            entityType: string;
            entityId: number;
            isPrimary: boolean;
            vendorId: number | null;
            productId: number | null;
        } | null;
        _count: {
            receivedMessages: number;
            sentMessages: number;
        };
    } & {
        name: string;
        email: string;
        phone: string;
        password: string;
        id: number;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUser(id: number, updateData: any): Promise<{
        vendor: {
            businessName: string;
            interests: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
        } | null;
        profileImage: {
            id: number;
            createdAt: Date;
            userId: number | null;
            url: string;
            publicId: string;
            entityType: string;
            entityId: number;
            isPrimary: boolean;
            vendorId: number | null;
            productId: number | null;
        } | null;
    } & {
        name: string;
        email: string;
        phone: string;
        password: string;
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
                name: string;
                email: string;
                phone: string;
                id: number;
            };
            _count: {
                orders: number;
                products: number;
            };
            logo: {
                id: number;
                createdAt: Date;
                userId: number | null;
                url: string;
                publicId: string;
                entityType: string;
                entityId: number;
                isPrimary: boolean;
                vendorId: number | null;
                productId: number | null;
            } | null;
        } & {
            businessName: string;
            interests: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
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
                    name: string;
                    email: string;
                    id: number;
                };
            } & {
                businessName: string;
                interests: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                userId: number;
            };
            images: {
                id: number;
                createdAt: Date;
                userId: number | null;
                url: string;
                publicId: string;
                entityType: string;
                entityId: number;
                isPrimary: boolean;
                vendorId: number | null;
                productId: number | null;
            }[];
        } & {
            description: string | null;
            title: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            vendorId: number;
            price: number;
            stock: number;
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
                    name: string;
                    email: string;
                    id: number;
                };
            } & {
                businessName: string;
                interests: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                userId: number;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            total: number;
            sellerId: number;
            status: string;
            buyerId: number;
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
