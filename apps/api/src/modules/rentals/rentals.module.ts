import { Module } from '@nestjs/common';
import { RentalsController } from './rentals.controller';
import { RentalsService } from './rentals.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [RentalsController],
  providers: [RentalsService, PrismaService],
  exports: [RentalsService],
})
export class RentalsModule {}
