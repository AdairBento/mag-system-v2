import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterInspectionDto {
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) skip?: number = 0;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) take?: number = 10;
}
