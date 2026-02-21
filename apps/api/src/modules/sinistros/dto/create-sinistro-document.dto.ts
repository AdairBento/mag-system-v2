import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSinistroDocumentDto {
  @ApiProperty() @IsString() type: string;
  @ApiProperty() @IsString() url: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
}
