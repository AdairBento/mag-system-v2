import { IsOptional, IsString, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MaintenanceType, MaintenanceStatus } from '@mag-system/database';

export class FilterMaintenanceDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() vehicleId?: string;
  @ApiProperty({ required: false, enum: MaintenanceType })
  @IsOptional()
  @IsEnum(MaintenanceType)
  type?: MaintenanceType;
  @ApiProperty({ required: false, enum: MaintenanceStatus })
  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() startDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() endDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() skip?: number;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() take?: number;
}
