import { PrismaService } from '../../prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorQueryDto } from './dto/vendor-query.dto';
export declare class VendorsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createVendorDto: CreateVendorDto): Promise<any>;
    findAll(query: VendorQueryDto): Promise<any[]>;
    findOne(id: number): Promise<any>;
    update(id: number, userId: number, updateVendorDto: UpdateVendorDto): Promise<any>;
    getVendorByUserId(userId: number): Promise<any>;
}
