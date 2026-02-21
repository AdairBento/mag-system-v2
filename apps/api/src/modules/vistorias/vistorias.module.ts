import { Module } from '@nestjs/common';
import { VistoriasController } from './vistorias.controller';
import { VistoriasService } from './vistorias.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [VistoriasController],
  providers: [VistoriasService, PrismaService],
  exports: [VistoriasService],
})
export class VistoriasModule {}
