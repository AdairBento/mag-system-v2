import { IsString, IsDateString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

export class CreateRentalDto {
  @IsString()
  clientId: string;

  @IsString()
  driverId: string;

  @IsString()
  vehicleId: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsNumber()
  @Min(0)
  dailyRate: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  deposit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateRentalDto {
  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  driverId?: string;

  @IsOptional()
  @IsString()
  vehicleId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsDateString()
  returnDate?: Date;

  @IsOptional()
  @IsNumber()
  dailyRate?: number;

  @IsOptional()
  @IsNumber()
  deposit?: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'])
  status?: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface RentalResponseDto {
  id: string;
  clientId: string;
  driverId: string;
  vehicleId: string;
  startDate: Date;
  endDate: Date;
  returnDate?: Date;
  dailyRate: number;
  totalDays: number;
  totalAmount: number;
  deposit: number;
  discount: number;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class FilterRentalDto {
  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  driverId?: string;

  @IsOptional()
  @IsString()
  vehicleId?: string;

  @IsOptional()
  @IsEnum(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'])
  status?: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;
}

export interface RentalStatsDto {
  total: number;
  pending: number;
  active: number;
  completed: number;
  cancelled: number;
}
