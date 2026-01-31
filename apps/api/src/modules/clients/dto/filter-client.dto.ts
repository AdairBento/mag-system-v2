import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ClientStatus, DocumentType } from '@mag-system/shared-types';

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
}
