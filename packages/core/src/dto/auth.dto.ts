import { IsString, IsEmail, MinLength, Matches, IsOptional, IsEnum, MaxLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]/, { message: 'Senha deve conter letra maiúscula' })
  @Matches(/[a-z]/, { message: 'Senha deve conter letra minúscula' })
  @Matches(/[0-9]/, { message: 'Senha deve conter número' })
  password: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsEnum(['ADMIN', 'MANAGER', 'OPERATOR'])
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

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;

  @IsString()
  confirmPassword: string;
}
