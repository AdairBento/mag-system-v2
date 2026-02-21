import { IsString, IsOptional, IsDateString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TransactionType, PaymentMethod } from '@mag-system/database';

export class CreateTransactionDto {
  @ApiProperty({ enum: TransactionType }) @IsEnum(TransactionType) type: TransactionType;
  @ApiProperty() @IsString() category: string;
  @ApiProperty() @Type(() => Number) @IsNumber() amount: number;
  @ApiProperty() @IsDateString() date: string;
  @ApiProperty({ enum: PaymentMethod }) @IsEnum(PaymentMethod) paymentMethod: PaymentMethod;
  @ApiProperty() @IsString() description: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() invoiceId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() reference?: string;
}
