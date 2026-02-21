import { Module } from '@nestjs/common';
import { SegurosService } from './seguros.service';
import { SegurosController } from './seguros.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [SegurosController],
  providers: [SegurosService, PrismaService],
  exports: [SegurosService],
})
export class SegurosModule {}
