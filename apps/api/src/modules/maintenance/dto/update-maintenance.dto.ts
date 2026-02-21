import { PartialType } from '@nestjs/swagger';
import { CreateMaintenanceDto } from './create-maintenance.dto';
import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MaintenanceStatus } from '@mag-system/database';

export class UpdateMaintenanceDto extends PartialType(CreateMaintenanceDto) {
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() completedDate?: string;
  @ApiProperty({ required: false, enum: MaintenanceStatus })
  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus;
}
