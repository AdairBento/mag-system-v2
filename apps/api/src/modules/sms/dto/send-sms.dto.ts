import { IsString, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendSmsDto {
  @ApiProperty({ description: 'E.164 phone number' })
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/)
  to: string;
  @ApiProperty() @IsString() message: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() sender?: string;
}
