import { IsOptional, IsString, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AccidentSeverity, AccidentStatus } from '@mag-system/database';

export class FilterSinistroDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() vehicleId?: string;
  @ApiProperty({ required: false, enum: AccidentSeverity })
  @IsOptional()
  @IsEnum(AccidentSeverity)
  severity?: AccidentSeverity;
  @ApiProperty({ required: false, enum: AccidentStatus })
  @IsOptional()
  @IsEnum(AccidentStatus)
  status?: AccidentStatus;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() startDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() endDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() skip?: number;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() take?: number;
}
