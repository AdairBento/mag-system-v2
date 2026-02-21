import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContractStatus } from '@mag-system/database';

export class CreateContractDto {
  @ApiProperty() @IsString() rentalId: string;
  @ApiProperty() @IsString() fileUrl: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() signedBy?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() signedAt?: string;
  @ApiProperty({ required: false, enum: ContractStatus })
  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;
}
