import { IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ExcelReport {
  RENTALS = 'RENTALS',
  FINANCIAL = 'FINANCIAL',
  FLEET = 'FLEET',
  CLIENTS = 'CLIENTS',
}

export enum ExcelFormat {
  CSV = 'CSV',
  XLSX = 'XLSX',
}

export class GenerateExcelDto {
  @ApiProperty({ enum: ExcelReport }) @IsEnum(ExcelReport) report: ExcelReport;
  @ApiProperty({ required: false }) @IsOptional() filters?: {
    startDate?: string;
    endDate?: string;
  };
  @ApiProperty({ required: false, enum: ExcelFormat, default: ExcelFormat.CSV })
  @IsOptional()
  @IsEnum(ExcelFormat)
  format?: ExcelFormat;
}
