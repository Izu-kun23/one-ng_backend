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
        name: string;
        email: string;
        phone: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        name: string;
        email: string;
        phone: string;
        id: number;
    } | null>;
    updateProfile(id: number, updateUserDto: UpdateUserDto): Promise<{
        name: string;
        email: string;
        phone: string;
        id: number;
        updatedAt: Date;
    }>;
}
