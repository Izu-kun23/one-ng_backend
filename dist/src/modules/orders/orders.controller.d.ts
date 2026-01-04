import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto, user: any): Promise<{
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
    findAll(role: 'buyer' | 'seller' | 'all', user: any): Promise<({
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
    findOne(id: number, user: any): Promise<{
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
    updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto, user: any): Promise<{
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
