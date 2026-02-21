import { PartialType } from '@nestjs/swagger';
import { CreateSeguroDto } from './create-seguro.dto';

export class UpdateSeguroDto extends PartialType(CreateSeguroDto) {}
