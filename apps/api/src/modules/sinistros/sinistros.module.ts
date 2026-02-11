import { Module } from '@nestjs/common';
import { SinistrosService } from './sinistros.service';
import { SinistrosController } from './sinistros.controller';

@Module({
  controllers: [SinistrosController],
  providers: [SinistrosService],
  exports: [SinistrosService],
})
export class SinistrosModule {}
