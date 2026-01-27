import { IsString, IsNumber, IsOptional, IsEnum, MinLength, MaxLength, Min, Max } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  plate: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  brand: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  model: string;

  @IsNumber()
  @Min(1990)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsString()
  color: string;

  @IsString()
  registrationNumber: string;

  @IsString()
  @MinLength(17)
  @MaxLength(17)
  chassis: string;

  @IsNumber()
  @Min(0)
  dailyRate: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  mileage?: number;

  @IsEnum(['GASOLINE', 'ETHANOL', 'DIESEL', 'FLEX', 'ELECTRIC', 'HYBRID'])
  fuelType: 'GASOLINE' | 'ETHANOL' | 'DIESEL' | 'FLEX' | 'ELECTRIC' | 'HYBRID';

  @IsEnum(['MANUAL', 'AUTOMATIC'])
  transmission: 'MANUAL' | 'AUTOMATIC';

  @IsEnum(['COMPACT', 'SEDAN', 'SUV', 'PICKUP', 'VAN', 'LUXURY'])
  category: 'COMPACT' | 'SEDAN' | 'SUV' | 'PICKUP' | 'VAN' | 'LUXURY';

  @IsOptional()
  @IsNumber()
  capacity?: number;
}

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  plate?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  chassis?: string;

  @IsOptional()
  @IsNumber()
  dailyRate?: number;

  @IsOptional()
  @IsNumber()
  mileage?: number;

  @IsOptional()
  @IsEnum(['GASOLINE', 'ETHANOL', 'DIESEL', 'FLEX', 'ELECTRIC', 'HYBRID'])
  fuelType?: string;

  @IsOptional()
  @IsEnum(['MANUAL', 'AUTOMATIC'])
  transmission?: string;

  @IsOptional()
  @IsEnum(['COMPACT', 'SEDAN', 'SUV', 'PICKUP', 'VAN', 'LUXURY'])
  category?: string;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsEnum(['AVAILABLE', 'RENTED', 'MAINTENANCE', 'INACTIVE'])
  status?: string;
}

export interface VehicleResponseDto {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  registrationNumber: string;
  chassis: string;
  dailyRate: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  category: string;
  capacity: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class FilterVehicleDto {
  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsEnum(['COMPACT', 'SEDAN', 'SUV', 'PICKUP', 'VAN', 'LUXURY'])
  category?: string;

  @IsOptional()
  @IsEnum(['AVAILABLE', 'RENTED', 'MAINTENANCE', 'INACTIVE'])
  status?: string;

  @IsOptional()
  @IsNumber()
  minDailyRate?: number;

  @IsOptional()
  @IsNumber()
  maxDailyRate?: number;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;
}

export interface VehicleStatsDto {
  total: number;
  available: number;
  rented: number;
  maintenance: number;
  inactive: number;
}
