import { IsOptional, IsString, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { InvoiceStatus } from '@mag-system/database';

export class FilterInvoiceDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() clientId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() rentalId?: string;
  @ApiProperty({ required: false, enum: InvoiceStatus })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() startDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() endDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() skip?: number;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() take?: number;
}
