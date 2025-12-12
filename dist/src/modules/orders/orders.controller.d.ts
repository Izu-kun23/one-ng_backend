import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto, user: any): Promise<{
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
    findAll(role: 'buyer' | 'seller' | 'all', user: any): Promise<({
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
    findOne(id: number, user: any): Promise<{
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
    updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto, user: any): Promise<{
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
