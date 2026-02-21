import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DamageSeverity } from '@mag-system/database';

export class CreateDamageDto {
  @ApiProperty() @IsString() inspectionId: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty({ enum: DamageSeverity }) @IsEnum(DamageSeverity) severity: DamageSeverity;
  @ApiProperty() @IsString() location: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  estimatedCost?: number;
}
