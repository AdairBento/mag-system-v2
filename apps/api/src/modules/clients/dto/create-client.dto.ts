import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '@mag-system/shared-types';

export class CreateClientDto {
  @ApiProperty({ example: 'João da Silva', description: 'Client full name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'joao@example.com', description: 'Client email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '11999999999', description: 'Client phone number' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '12345678900', description: 'CPF or CNPJ document number' })
  @IsString()
  document: string;

  @ApiProperty({
    enum: DocumentType,
    example: DocumentType.CPF,
    description: 'Document type'
  })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({ example: 'Rua Exemplo, 123', description: 'Street address', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'São Paulo', description: 'City name', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'SP', description: 'State abbreviation', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: '01234-567', description: 'Postal code', required: false })
  @IsString()
  @IsOptional()
  zipCode?: string;
}
