import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PdfTemplate {
  CONTRACT = 'CONTRACT',
  INVOICE = 'INVOICE',
  RENTAL_RECEIPT = 'RENTAL_RECEIPT',
}

export class GeneratePdfDto {
  @ApiProperty({ enum: PdfTemplate }) @IsEnum(PdfTemplate) template: PdfTemplate;
  @ApiProperty() @IsString() resourceId: string;
  @ApiProperty({ required: false }) @IsOptional() options?: {
    orientation?: 'portrait' | 'landscape';
    format?: string;
  };
}
