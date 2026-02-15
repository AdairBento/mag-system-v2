import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole, UserStatus } from '@prisma/client';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email inválido' })
  @MaxLength(320, { message: 'Email excede 320 caracteres' })
  email!: string;

  @IsString({ message: 'Senha deve ser texto' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @MaxLength(100, { message: 'Senha excede 100 caracteres' })
  password!: string;

  @IsString({ message: 'Nome deve ser texto' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MaxLength(255, { message: 'Nome excede 255 caracteres' })
  name!: string;

  @IsEnum(UserRole, { message: 'Papel inválido. Use: ADMIN, MANAGER ou OPERATOR' })
  @IsOptional()
  role?: UserRole;

  @IsEnum(UserStatus, { message: 'Status inválido. Use: ACTIVE ou INACTIVE' })
  @IsOptional()
  status?: UserStatus;
}
