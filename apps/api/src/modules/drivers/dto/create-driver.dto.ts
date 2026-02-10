import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export enum LicenseCategory {
  A = 'A',
  B = 'B',
  AB = 'AB',
  C = 'C',
  D = 'D',
  E = 'E',
  AC = 'AC',
  AD = 'AD',
  AE = 'AE',
}

export enum DriverStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export class CreateDriverDto {
  @IsUUID()
  @IsOptional()
  clientId?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  document: string;

  @IsString()
  @IsNotEmpty()
  licenseNumber: string;

  @IsEnum(LicenseCategory)
  @IsNotEmpty()
  licenseCategory: LicenseCategory;

  @IsDateString()
  @IsNotEmpty()
  licenseExpiresAt: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  zipCode?: string;

  @IsEnum(DriverStatus)
  @IsOptional()
  status?: DriverStatus;
}
