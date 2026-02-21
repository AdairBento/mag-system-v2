import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendWhatsappDto {
  @ApiProperty() @IsString() to: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() message?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() mediaUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() templateName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsArray() templateParams?: string[];
}
