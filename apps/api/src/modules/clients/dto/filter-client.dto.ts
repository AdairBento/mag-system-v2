import { IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterClientDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  skip?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  take?: number;
}
