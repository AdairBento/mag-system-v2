import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePhotoDto {
  @ApiProperty() @IsString() inspectionId: string;
  @ApiProperty() @IsString() url: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
}
