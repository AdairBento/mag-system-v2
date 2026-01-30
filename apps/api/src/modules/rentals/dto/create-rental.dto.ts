import { IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRentalDto {
  @ApiProperty() @IsString() clientId: string;
  @ApiProperty() @IsString() driverId: string;
  @ApiProperty() @IsString() vehicleId: string;
  @ApiProperty() @IsDateString() startDate: string;
  @ApiProperty() @IsDateString() endDate: string;
  @ApiProperty() @IsNumber() dailyRate: number;
  @ApiProperty() @IsNumber() totalDays: number;
  @ApiProperty() @IsNumber() totalAmount: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() deposit?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() discount?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() notes?: string;
}
