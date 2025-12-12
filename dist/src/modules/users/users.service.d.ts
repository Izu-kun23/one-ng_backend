import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(id: number): Promise<{
        vendor: {
            id: number;
            businessName: string;
            interests: string | null;
        } | null;
        email: string;
        phone: string;
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        email: string;
        phone: string;
        name: string;
        id: number;
    } | null>;
    updateProfile(id: number, updateUserDto: UpdateUserDto): Promise<{
        email: string;
        phone: string;
        name: string;
        id: number;
        updatedAt: Date;
    }>;
}
