import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentType, ClientStatus } from '@mag-system/shared-types';

export class UpdateClientDto {
  @ApiPropertyOptional({ example: 'João da Silva', description: 'Client full name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'joao@example.com', description: 'Client email address' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '11999999999', description: 'Client phone number' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '12345678900', description: 'CPF or CNPJ document number' })
  @IsString()
  @IsOptional()
  document?: string;

  @ApiPropertyOptional({
    enum: DocumentType,
    example: DocumentType.CPF,
    description: 'Document type'
  })
  @IsEnum(DocumentType)
  @IsOptional()
  documentType?: DocumentType;

  @ApiPropertyOptional({
    enum: ClientStatus,
    example: ClientStatus.ACTIVE,
    description: 'Client status'
  })
  @IsEnum(ClientStatus)
  @IsOptional()
  status?: ClientStatus;

  @ApiPropertyOptional({ example: 'Rua Exemplo, 123', description: 'Street address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'São Paulo', description: 'City name' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'SP', description: 'State abbreviation' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ example: '01234-567', description: 'Postal code' })
  @IsString()
  @IsOptional()
  zipCode?: string;
}
