import { Module } from '@nestjs/common';
import { SinistrosController } from './sinistros.controller';
import { SinistrosService } from './sinistros.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [SinistrosController],
  providers: [SinistrosService, PrismaService],
  exports: [SinistrosService],
})
export class SinistrosModule {}
