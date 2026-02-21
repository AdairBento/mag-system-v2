import { PartialType } from '@nestjs/swagger';
import { CreateMultaDto } from './create-multa.dto';
import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FineStatus } from '@mag-system/database';

export class UpdateMultaDto extends PartialType(CreateMultaDto) {
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() paidDate?: string;
  @ApiProperty({ required: false, enum: FineStatus })
  @IsOptional()
  @IsEnum(FineStatus)
  status?: FineStatus;
}
