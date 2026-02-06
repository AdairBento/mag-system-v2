import { IsOptional, IsEnum, IsUUID, IsDateString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RentalStatus } from '@mag-system/database';

export class FilterRentalDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Items per page', minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ enum: RentalStatus, description: 'Rental status' })
  @IsOptional()
  @IsEnum(RentalStatus)
  status?: RentalStatus;

  @ApiPropertyOptional({ description: 'Client ID' })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiPropertyOptional({ description: 'Vehicle ID' })
  @IsOptional()
  @IsUUID()
  vehicleId?: string;

  @ApiPropertyOptional({ description: 'Driver ID' })
  @IsOptional()
  @IsUUID()
  driverId?: string;

  @ApiPropertyOptional({ description: 'Start date from (ISO 8601)', example: '2026-02-01' })
  @IsOptional()
  @IsDateString()
  startDateFrom?: string;

  @ApiPropertyOptional({ description: 'Start date to (ISO 8601)', example: '2026-02-28' })
  @IsOptional()
  @IsDateString()
  startDateTo?: string;

  @ApiPropertyOptional({ description: 'End date from (ISO 8601)', example: '2026-02-01' })
  @IsOptional()
  @IsDateString()
  endDateFrom?: string;

  @ApiPropertyOptional({ description: 'End date to (ISO 8601)', example: '2026-02-28' })
  @IsOptional()
  @IsDateString()
  endDateTo?: string;

  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: ['createdAt', 'startDate', 'endDate', 'totalAmount', 'status'],
    default: 'createdAt',
  })
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
