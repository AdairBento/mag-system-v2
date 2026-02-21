import { IsString, IsOptional, IsEmail, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDto {
  @ApiProperty() @IsEmail() to: string;
  @ApiProperty() @IsString() subject: string;
  @ApiProperty() @IsString() template: string;
  @ApiProperty({ required: false }) @IsOptional() data?: Record<string, any>;
  @ApiProperty({ required: false }) @IsOptional() @IsArray() cc?: string[];
  @ApiProperty({ required: false }) @IsOptional() @IsArray() bcc?: string[];
}
