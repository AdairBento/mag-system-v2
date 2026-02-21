import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum FileCategory {
  CONTRACT = 'CONTRACT',
  PHOTO = 'PHOTO',
  DOCUMENT = 'DOCUMENT',
  OTHER = 'OTHER',
}

export class UploadFileDto {
  @ApiProperty() @IsString() filename: string;
  @ApiProperty() @IsString() mimeType: string;
  @ApiProperty() @Type(() => Number) @IsNumber() size: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() base64Content?: string;
  @ApiProperty({ required: false, enum: FileCategory })
  @IsOptional()
  @IsEnum(FileCategory)
  category?: FileCategory;
}
