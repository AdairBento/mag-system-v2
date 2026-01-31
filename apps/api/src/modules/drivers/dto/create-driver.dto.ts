import { IsString, IsEmail, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LicenseCategory } from '@mag-system/shared-types';

export class CreateDriverDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  document: string;

  @ApiProperty()
  @IsString()
  licenseNumber: string;

  @ApiProperty({
    enum: LicenseCategory,
    example: LicenseCategory.B,
    description: 'Driver license category'
  })
  @IsEnum(LicenseCategory)
  licenseCategory: LicenseCategory;

  @ApiProperty()
  @IsDateString()
  licenseExpiresAt: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  zipCode?: string;
}
