import { PartialType } from '@nestjs/swagger';
import { CreateSinistroDto } from './create-sinistro.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccidentStatus } from '@mag-system/database';

export class UpdateSinistroDto extends PartialType(CreateSinistroDto) {
  @ApiProperty({ required: false, enum: AccidentStatus })
  @IsOptional()
  @IsEnum(AccidentStatus)
  status?: AccidentStatus;
}
