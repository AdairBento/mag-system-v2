import { IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FilterClientDto {
  @ApiProperty({
    example: 0,
    description: 'Number of records to skip',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  skip?: number;

  @ApiProperty({
    example: 10,
    description: 'Number of records to take',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  take?: number;
}
