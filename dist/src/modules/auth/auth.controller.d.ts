import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    logout(user: any): Promise<{
        message: string;
    }>;
}
