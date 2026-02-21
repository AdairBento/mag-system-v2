import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateInvoiceDto {
  @ApiProperty() @IsString() clientId: string;
  @ApiProperty() @IsString() invoiceNumber: string;
  @ApiProperty() @Type(() => Number) @IsNumber() amount: number;
  @ApiProperty() @IsDateString() dueDate: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() rentalId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() notes?: string;
}
