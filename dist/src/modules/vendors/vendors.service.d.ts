import { PrismaService } from '../../prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorQueryDto } from './dto/vendor-query.dto';
export declare class VendorsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createVendorDto: CreateVendorDto): Promise<{
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
    }>;
    findAll(query: VendorQueryDto): Promise<({
        user: {
            name: string;
            email: string;
            phone: string;
            id: number;
        };
        _count: {
            products: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        businessName: string;
        interests: string | null;
        userId: number;
    })[]>;
    findOne(id: number): Promise<{
        user: {
            name: string;
            email: string;
            phone: string;
            id: number;
        };
        _count: {
            products: number;
        };
        products: {
            description: string | null;
            title: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            stock: number;
            vendorId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        businessName: string;
        interests: string | null;
        userId: number;
    }>;
    update(id: number, userId: number, updateVendorDto: UpdateVendorDto): Promise<{
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
    }>;
}
