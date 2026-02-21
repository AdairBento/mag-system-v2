import { IsString, IsOptional, IsDateString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AccidentSeverity } from '@mag-system/database';

export class CreateSinistroDto {
  @ApiProperty() @IsString() vehicleId: string;
  @ApiProperty() @IsDateString() date: string;
  @ApiProperty() @IsString() location: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty({ enum: AccidentSeverity }) @IsEnum(AccidentSeverity) severity: AccidentSeverity;
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  estimatedCost?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() claimNumber?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() insuranceId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() notes?: string;
}
