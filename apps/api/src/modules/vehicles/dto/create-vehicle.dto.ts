import { IsString, IsNumber, IsEnum, IsOptional, Min, Max, Length, Matches } from 'class-validator';
import { VehicleCategory, VehicleStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum FuelType {
  GASOLINE = 'GASOLINE',
  ETHANOL = 'ETHANOL',
  FLEX = 'FLEX',
  DIESEL = 'DIESEL',
  ELECTRIC = 'ELECTRIC',
}

export enum Transmission {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
}

export class CreateVehicleDto {
  @ApiProperty({ example: 'ABC-1234', description: 'Placa do veículo' })
  @IsString()
  @Length(7, 8)
  @Matches(/^[A-Z]{3}-?[0-9A-Z]{4}$/)
  plate: string;

  @ApiProperty({ example: '12345678901234567', description: 'Número de registro/Renavam' })
  @IsString()
  registrationNumber: string;

  @ApiProperty({ example: '9BWZZZ377VT004251', description: 'Número do chassi' })
  @IsString()
  @Length(17, 17)
  chassis: string;

  @ApiProperty({ example: 'Volkswagen' })
  @IsString()
  brand: string;

  @ApiProperty({ example: 'Gol' })
  @IsString()
  model: string;

  @ApiProperty({ example: 2022 })
  @IsNumber()
  @Min(1990)
  @Max(2027)
  year: number;

  @ApiProperty({ example: 'Prata' })
  @IsString()
  color: string;

  @ApiProperty({ enum: VehicleCategory, example: 'ECONOMIC' })
  @IsEnum(VehicleCategory)
  category: VehicleCategory;

  @ApiProperty({ enum: FuelType, example: 'FLEX' })
  @IsEnum(FuelType)
  fuelType: FuelType;

  @ApiProperty({ enum: Transmission, example: 'MANUAL' })
  @IsEnum(Transmission)
  transmission: Transmission;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(2)
  @Max(12)
  seats: number;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @Min(0)
  km: number;

  @ApiProperty({ example: 150.0, description: 'Valor da diária em reais' })
  @IsNumber()
  @Min(0)
  dailyRate: number;

  @ApiProperty({ enum: VehicleStatus, example: 'AVAILABLE' })
  @IsEnum(VehicleStatus)
  status: VehicleStatus;

  @ApiPropertyOptional({ example: ['Ar condicionado', 'Direção hidráulica'] })
  @IsOptional()
  @IsString({ each: true })
  features?: string[];
}
