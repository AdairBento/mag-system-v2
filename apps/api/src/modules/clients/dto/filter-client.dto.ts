import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ClientStatus, DocumentType } from '@mag-system/shared-types';
import { Type } from 'class-transformer';

export class FilterClientDto {
  @ApiPropertyOptional({ enum: ClientStatus, description: 'Filter by client status' })
  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus;

  @ApiPropertyOptional({ enum: DocumentType, description: 'Filter by document type' })
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  @ApiPropertyOptional({ description: 'Search by name (partial match)' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Search by email (partial match)' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Search by document number' })
  @IsOptional()
  document?: string;

  @ApiPropertyOptional({ default: 0, description: 'Number of records to skip' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({ default: 10, description: 'Number of records to take' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number;
}
