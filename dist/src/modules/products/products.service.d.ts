import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createProductDto: CreateProductDto): Promise<{
        vendor: {
            user: {
                name: string;
                email: string;
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
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        stock: number;
        vendorId: number;
    }>;
    findAll(query: ProductQueryDto): Promise<{
        data: ({
            vendor: {
                user: {
                    name: string;
                    email: string;
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
            description: string | null;
            title: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
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
    findOne(id: number): Promise<{
        vendor: {
            user: {
                name: string;
                email: string;
                phone: string;
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
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        stock: number;
        vendorId: number;
    }>;
    findByVendor(vendorId: number): Promise<({
        vendor: {
            user: {
                name: string;
                email: string;
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
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        stock: number;
        vendorId: number;
    })[]>;
    update(id: number, userId: number, updateProductDto: UpdateProductDto): Promise<{
        vendor: {
            user: {
                name: string;
                email: string;
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
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        stock: number;
        vendorId: number;
    }>;
    remove(id: number, userId: number): Promise<{
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        stock: number;
        vendorId: number;
    }>;
}
