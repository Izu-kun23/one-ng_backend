import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(buyerId: number, createOrderDto: CreateOrderDto): Promise<{
        vendor: {
            user: {
                email: string;
                phone: string;
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
    }>;
    findAll(userId: number, role?: 'buyer' | 'seller' | 'all'): Promise<({
        vendor: {
            user: {
                email: string;
                phone: string;
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
    })[]>;
    findOne(id: number, userId: number): Promise<{
        vendor: {
            user: {
                email: string;
                phone: string;
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
    }>;
    updateStatus(id: number, userId: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<{
        vendor: {
            user: {
                email: string;
                phone: string;
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
    }>;
}
