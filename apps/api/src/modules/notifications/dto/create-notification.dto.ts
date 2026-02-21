import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() userId?: string;
  @ApiProperty() @IsString() action: string;
  @ApiProperty() @IsString() resource: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() resourceId?: string;
  @ApiProperty({ required: false }) @IsOptional() metadata?: Record<string, any>;
}
