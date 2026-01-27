export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RegisterDto {
    email: string;
    password: string;
    name: string;
    role?: 'ADMIN' | 'MANAGER' | 'OPERATOR';
}
export interface AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: 'ADMIN' | 'MANAGER' | 'OPERATOR';
    };
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
//# sourceMappingURL=auth.dto.d.ts.map