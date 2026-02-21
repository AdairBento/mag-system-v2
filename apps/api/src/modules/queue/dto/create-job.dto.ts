import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum JobPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
}

export class CreateJobDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ required: false }) @IsOptional() payload?: Record<string, any>;
  @ApiProperty({ required: false, enum: JobPriority, default: JobPriority.NORMAL })
  @IsOptional()
  @IsEnum(JobPriority)
  priority?: JobPriority;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() delay?: number;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() retries?: number;
}
