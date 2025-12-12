import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto, user: any): Promise<{
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
    update(id: number, updateProductDto: UpdateProductDto, user: any): Promise<{
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
    remove(id: number, user: any): Promise<{
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
