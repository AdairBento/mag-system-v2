import { IsString, IsEmail, IsOptional, IsEnum, Matches, MinLength, MaxLength, IsDateString } from 'class-validator';

export class CreateDriverDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^\(\d{2}\) \d{4,5}-\d{4}$/)
  phone: string;

  @IsString()
  document: string;

  @IsString()
  @Matches(/^\d{11}$/)
  licenseNumber: string;

  @IsEnum(['A', 'B', 'AB', 'C', 'D', 'E'])
  licenseCategory: 'A' | 'B' | 'AB' | 'C' | 'D' | 'E';

  @IsDateString()
  licenseExpiresAt: Date;

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

export class UpdateDriverDto {
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
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsEnum(['A', 'B', 'AB', 'C', 'D', 'E'])
  licenseCategory?: 'A' | 'B' | 'AB' | 'C' | 'D' | 'E';

  @IsOptional()
  @IsDateString()
  licenseExpiresAt?: Date;

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
  @IsEnum(['ACTIVE', 'INACTIVE', 'SUSPENDED'])
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface DriverResponseDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  licenseNumber: string;
  licenseCategory: 'A' | 'B' | 'AB' | 'C' | 'D' | 'E';
  licenseExpiresAt: Date;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class FilterDriverDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  document?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE', 'SUSPENDED'])
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;
}
