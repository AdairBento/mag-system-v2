import { IsOptional, IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { VehicleCategory, VehicleStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterVehicleDto {
  @ApiPropertyOptional({ description: 'Buscar por placa, marca ou modelo' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: VehicleStatus })
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @ApiPropertyOptional({ enum: VehicleCategory })
  @IsOptional()
  @IsEnum(VehicleCategory)
  category?: VehicleCategory;

  @ApiPropertyOptional({ description: 'Página (começa em 1)', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Itens por página', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  // Campos calculados (não expostos na API)
  skip?: number;
  take?: number;
}
