import { PartialType } from '@nestjs/swagger';
import { CreateDamageDto } from './create-damage.dto';

export class UpdateDamageDto extends PartialType(CreateDamageDto) {}
