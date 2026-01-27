import { IsString, IsEmail, IsOptional, IsEnum, Matches, MinLength, MaxLength } from 'class-validator';

/**
 * DTOs para módulo de Clientes (CLASSES com validação)
 */

export class CreateClientDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, { message: 'Formato: (99) 99999-9999' })
  phone!: string;

  @IsString()
  document!: string;

  @IsEnum(['CPF', 'CNPJ'])
  documentType!: 'CPF' | 'CNPJ';

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2)
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;
}

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  document?: string;

  @IsOptional()
  @IsEnum(['CPF', 'CNPJ'])
  documentType?: 'CPF' | 'CNPJ';

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE', 'BLOCKED'])
  status?: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
}

export interface ClientResponseDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  documentType: 'CPF' | 'CNPJ';
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class FilterClientDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  document?: string;

  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE', 'BLOCKED'])
  status?: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;
}
