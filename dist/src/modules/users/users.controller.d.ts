import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    updateProfile(id: number, updateUserDto: UpdateUserDto, currentUser: any): Promise<{
        email: string;
        phone: string;
        name: string;
        id: number;
        updatedAt: Date;
    }>;
}
