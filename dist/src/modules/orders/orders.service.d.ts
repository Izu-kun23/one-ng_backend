import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(buyerId: number, createOrderDto: CreateOrderDto): Promise<{
        vendor: {
            user: {
                name: string;
                email: string;
                phone: string;
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
    }>;
    findAll(userId: number, role?: 'buyer' | 'seller' | 'all'): Promise<({
        vendor: {
            user: {
                name: string;
                email: string;
                phone: string;
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
    })[]>;
    findOne(id: number, userId: number): Promise<{
        vendor: {
            user: {
                name: string;
                email: string;
                phone: string;
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
    }>;
    updateStatus(id: number, userId: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<{
        vendor: {
            user: {
                name: string;
                email: string;
                phone: string;
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
    }>;
}
