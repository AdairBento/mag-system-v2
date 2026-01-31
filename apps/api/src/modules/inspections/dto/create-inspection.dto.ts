import { IsString, IsInt, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InspectionType } from '@mag-system/shared-types';
import { Type } from 'class-transformer';

export class CreateInspectionDto {
  @ApiProperty({ description: 'Rental UUID', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsString()
  rentalId: string;

  @ApiProperty({ description: 'Vehicle UUID', example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' })
  @IsString()
  vehicleId: string;

  @ApiProperty({
    enum: InspectionType,
    example: InspectionType.PICKUP,
    description: 'Type of inspection (pickup or return)'
  })
  @IsEnum(InspectionType)
  type: InspectionType;

  @ApiProperty({ description: 'Current vehicle mileage in km', example: 50000, minimum: 0 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  mileage: number;

  @ApiProperty({ description: 'Fuel level percentage (0-100)', example: 80, minimum: 0, maximum: 100 })
  @IsInt()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  fuelLevel: number;

  @ApiProperty({
    description: 'Additional inspection notes',
    example: 'Vehicle in good condition, minor scratch on rear bumper',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
