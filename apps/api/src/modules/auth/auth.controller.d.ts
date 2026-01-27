import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '@mag-system/core';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<import("@mag-system/core").AuthResponseDto>;
    login(loginDto: LoginDto): Promise<import("@mag-system/core").AuthResponseDto>;
}
//# sourceMappingURL=auth.controller.d.ts.map