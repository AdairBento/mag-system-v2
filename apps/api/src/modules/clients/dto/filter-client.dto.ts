import { IsOptional, IsEnum, IsInt, Min, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ClientStatus, DocumentType } from '@mag-system/shared-types';
import { Type } from 'class-transformer';

export class FilterClientDto {
  @ApiPropertyOptional({
    enum: ClientStatus,
    description: 'Filter by client status',
  })
  @IsOptional()
  @IsEnum(ClientStatus)
  status?: ClientStatus;

  @ApiPropertyOptional({
    enum: DocumentType,
    description: 'Filter by document type',
  })
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  @ApiPropertyOptional({
    description: 'Search by name, email or document (fuzzy search)',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    default: 'createdAt',
    enum: ['name', 'email', 'createdAt', 'updatedAt'],
    description: 'Field to order by',
  })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiPropertyOptional({
    default: 'desc',
    enum: ['asc', 'desc'],
    description: 'Order direction',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc';

  @ApiPropertyOptional({
    default: 0,
    description: 'Number of records to skip',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({
    default: 10,
    description: 'Number of records to take',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number;
}
