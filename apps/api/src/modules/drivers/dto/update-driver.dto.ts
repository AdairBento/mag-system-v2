import { IsString, IsEmail, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LicenseCategory, DriverStatus } from '@mag-system/shared-types';

export class UpdateDriverDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  document?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @ApiPropertyOptional({
    enum: LicenseCategory,
    example: LicenseCategory.B,
    description: 'Driver license category'
  })
  @IsEnum(LicenseCategory)
  @IsOptional()
  licenseCategory?: LicenseCategory;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  licenseExpiresAt?: string;

  @ApiPropertyOptional({
    enum: DriverStatus,
    example: DriverStatus.ACTIVE,
    description: 'Driver status'
  })
  @IsEnum(DriverStatus)
  @IsOptional()
  status?: DriverStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  zipCode?: string;
}
