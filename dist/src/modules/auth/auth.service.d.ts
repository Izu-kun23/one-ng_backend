import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
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
    validateUser(userId: number): Promise<{
        name: string;
        email: string;
        phone: string;
        id: number;
    } | null>;
}
