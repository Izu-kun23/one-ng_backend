import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            vendor: {
                businessName: string;
                interests: string | null;
                id: number;
                logo: {
                    id: number;
                    url: string;
                    publicId: string;
                    isPrimary: boolean;
                } | null;
            } | null;
            name: string;
            email: string;
            phone: string;
            id: number;
            createdAt: Date;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            name: string;
            phone: string;
        };
    }>;
    logout(userId: number): Promise<{
        message: string;
    }>;
    validateUser(userId: number): Promise<{
        name: string;
        email: string;
        phone: string;
        id: number;
    } | null>;
}
