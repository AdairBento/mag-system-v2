import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';
import { InsuranceStatus } from '@mag-system/database';

export { InsuranceStatus };

export class CreateSeguroDto {
  @ApiProperty({ description: 'ID do veículo' })
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({ description: 'Nome da seguradora' })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({ description: 'Número da apólice (único)' })
  @IsString()
  @IsNotEmpty()
  policyNumber: string;

  @ApiProperty({ description: 'Data de início da cobertura' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Data de vencimento' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Valor do prêmio', minimum: 0 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Tipo de cobertura (ex: total, terceiros)' })
  @IsString()
  @IsNotEmpty()
  coverageType: string;

  @ApiProperty({ enum: InsuranceStatus, required: false })
  @IsOptional()
  @IsEnum(InsuranceStatus)
  status?: InsuranceStatus;
}
