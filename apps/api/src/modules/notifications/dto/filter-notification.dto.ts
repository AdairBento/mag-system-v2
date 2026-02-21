import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterNotificationDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() userId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() resource?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() action?: string;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() skip?: number;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() take?: number;
}
