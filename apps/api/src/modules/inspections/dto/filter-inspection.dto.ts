import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { InspectionType, InspectionStatus } from '@mag-system/shared-types';

export class FilterInspectionDto {
  @ApiPropertyOptional({ enum: InspectionType, description: 'Filter by inspection type' })
  @IsOptional()
  @IsEnum(InspectionType)
  type?: InspectionType;

  @ApiPropertyOptional({ enum: InspectionStatus, description: 'Filter by inspection status' })
  @IsOptional()
  @IsEnum(InspectionStatus)
  status?: InspectionStatus;

  @ApiPropertyOptional({ description: 'Filter by rental ID' })
  @IsOptional()
  @IsString()
  rentalId?: string;

  @ApiPropertyOptional({ description: 'Filter by vehicle ID' })
  @IsOptional()
  @IsString()
  vehicleId?: string;
}
