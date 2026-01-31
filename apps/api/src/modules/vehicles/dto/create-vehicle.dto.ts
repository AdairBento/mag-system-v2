import { IsString, IsInt, IsDecimal, IsEnum, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FuelType, TransmissionType, VehicleCategory } from '@mag-system/shared-types';
import { Type } from 'class-transformer';

export class CreateVehicleDto {
  @ApiProperty({ example: 'ABC-1234', description: 'Vehicle license plate' })
  @IsString()
  plate: string;

  @ApiProperty({ example: 'Toyota', description: 'Vehicle brand' })
  @IsString()
  brand: string;

  @ApiProperty({ example: 'Corolla', description: 'Vehicle model' })
  @IsString()
  model: string;

  @ApiProperty({ example: 2023, description: 'Manufacturing year' })
  @IsInt()
  @Type(() => Number)
  year: number;

  @ApiProperty({ example: 'Prata', description: 'Vehicle color' })
  @IsString()
  color: string;

  @ApiProperty({ example: '12345678900', description: 'Vehicle registration number (RENAVAM)' })
  @IsString()
  registrationNumber: string;

  @ApiProperty({ example: '9BWZZZ377VT004251', description: 'Vehicle chassis number (VIN)' })
  @IsString()
  chassis: string;

  @ApiProperty({ example: '150.00', description: 'Daily rental rate in BRL' })
  @IsDecimal()
  dailyRate: string;

  @ApiProperty({
    enum: FuelType,
    example: FuelType.FLEX,
    description: 'Fuel type'
  })
  @IsEnum(FuelType)
  fuelType: FuelType;

  @ApiProperty({
    enum: TransmissionType,
    example: TransmissionType.AUTOMATIC,
    description: 'Transmission type'
  })
  @IsEnum(TransmissionType)
  transmission: TransmissionType;

  @ApiProperty({
    enum: VehicleCategory,
    example: VehicleCategory.SEDAN,
    description: 'Vehicle category'
  })
  @IsEnum(VehicleCategory)
  category: VehicleCategory;

  @ApiProperty({ example: 5, description: 'Passenger capacity', required: false, default: 5 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  capacity?: number;

  @ApiProperty({ example: 50000, description: 'Current mileage in km', required: false, default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  mileage?: number;
}
