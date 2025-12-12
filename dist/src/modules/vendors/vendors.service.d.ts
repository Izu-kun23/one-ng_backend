import { PrismaService } from '../../prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorQueryDto } from './dto/vendor-query.dto';
export declare class VendorsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createVendorDto: CreateVendorDto): Promise<{
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
    }>;
    findAll(query: VendorQueryDto): Promise<({
        user: {
            email: string;
            phone: string;
            name: string;
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
            email: string;
            phone: string;
            name: string;
            id: number;
        };
        _count: {
            products: number;
        };
        products: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
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
    }>;
}
