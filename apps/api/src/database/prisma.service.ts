import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@mag-system/database';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.\();
    console.log('✅ Database connected');
  }

  async onModuleDestroy() {
    await this.\();
    console.log('🔌 Database disconnected');
  }
}
