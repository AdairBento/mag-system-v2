import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateMultaDto {
  @ApiProperty() @IsString() vehicleId: string;
  @ApiProperty() @IsDateString() date: string;
  @ApiProperty() @IsString() location: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @Type(() => Number) @IsNumber() amount: number;
  @ApiProperty() @IsDateString() dueDate: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() driverId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() notes?: string;
}
