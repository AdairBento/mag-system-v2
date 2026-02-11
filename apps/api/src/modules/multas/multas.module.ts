import { Module } from '@nestjs/common';
import { MultasService } from './multas.service';
import { MultasController } from './multas.controller';

@Module({
  controllers: [MultasController],
  providers: [MultasService],
  exports: [MultasService],
})
export class MultasModule {}
