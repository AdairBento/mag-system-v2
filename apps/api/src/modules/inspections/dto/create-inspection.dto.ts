import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInspectionDto {
  @ApiProperty() @IsString() rentalId: string;
  @ApiProperty() @IsString() vehicleId: string;
  @ApiProperty() @IsString() type: string;
  @ApiProperty() @IsNumber() mileage: number;
  @ApiProperty() @IsNumber() fuelLevel: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() notes?: string;
}
