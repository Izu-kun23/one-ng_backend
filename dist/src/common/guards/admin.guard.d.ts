import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
export declare class AdminGuard extends JwtAuthGuard {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
