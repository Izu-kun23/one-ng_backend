import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorQueryDto } from './dto/vendor-query.dto';
export declare class VendorsController {
    private readonly vendorsService;
    constructor(vendorsService: VendorsService);
    create(createVendorDto: CreateVendorDto, user: any): Promise<any>;
    getMyProfile(req: any): Promise<any>;
    findAll(query: VendorQueryDto): Promise<any[]>;
    findOne(id: number): Promise<any>;
    update(id: number, updateVendorDto: UpdateVendorDto, user: any): Promise<any>;
}
