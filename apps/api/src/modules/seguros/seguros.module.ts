import { Module } from '@nestjs/common';
import { SegurosService } from './seguros.service';
import { SegurosController } from './seguros.controller';

@Module({
  controllers: [SegurosController],
  providers: [SegurosService],
  exports: [SegurosService],
})
export class SegurosModule {}
