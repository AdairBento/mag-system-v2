import { Module } from '@nestjs/common';
import { MultasController } from './multas.controller';
import { MultasService } from './multas.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [MultasController],
  providers: [MultasService, PrismaService],
  exports: [MultasService],
})
export class MultasModule {}
