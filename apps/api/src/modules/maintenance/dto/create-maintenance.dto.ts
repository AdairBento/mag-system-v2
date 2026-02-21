import { IsString, IsOptional, IsDateString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MaintenanceType } from '@mag-system/database';

export class CreateMaintenanceDto {
  @ApiProperty() @IsString() vehicleId: string;
  @ApiProperty({ enum: MaintenanceType }) @IsEnum(MaintenanceType) type: MaintenanceType;
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsDateString() scheduledDate: string;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() cost?: number;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() mileage?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() notes?: string;
}
