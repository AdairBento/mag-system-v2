import { IsOptional, IsString, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FineStatus } from '@mag-system/database';

export class FilterMultaDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() vehicleId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() driverId?: string;
  @ApiProperty({ required: false, enum: FineStatus })
  @IsOptional()
  @IsEnum(FineStatus)
  status?: FineStatus;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() startDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() endDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() skip?: number;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() take?: number;
}
