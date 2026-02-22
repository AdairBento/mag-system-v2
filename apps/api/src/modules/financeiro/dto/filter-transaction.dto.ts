import { IsOptional, IsString, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TransactionType, TransactionStatus } from '@mag-system/database';

export class FilterTransactionDto {
  @ApiProperty({ required: false, enum: TransactionType })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;
  @ApiProperty({ required: false, enum: TransactionStatus })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;
  @ApiProperty({ required: false }) @IsOptional() @IsString() invoiceId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() startDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() endDate?: string;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() skip?: number;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() take?: number;
}
