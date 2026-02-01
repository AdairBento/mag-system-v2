import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { VehicleStatus, FuelType, VehicleCategory } from '@mag-system/shared-types';
import { Type } from 'class-transformer';

export class FilterVehicleDto {
  @ApiPropertyOptional({ enum: VehicleStatus, description: 'Filter by vehicle status' })
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @ApiPropertyOptional({ enum: FuelType, description: 'Filter by fuel type' })
  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @ApiPropertyOptional({ enum: VehicleCategory, description: 'Filter by category' })
  @IsOptional()
  @IsEnum(VehicleCategory)
  category?: VehicleCategory;

  @ApiPropertyOptional({ description: 'Filter by brand' })
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional({ description: 'Filter by model' })
  @IsOptional()
  model?: string;

  @ApiPropertyOptional({ default: 0, description: 'Number of records to skip' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({ default: 10, description: 'Number of records to take' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number;
}
