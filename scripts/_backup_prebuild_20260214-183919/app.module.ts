import { Module } from '@nestjs/common';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { VistoriasModule } from './modules/vistorias/vistorias.module';
import { StorageModule } from './modules/storage/storage.module';
import { SmsModule } from './modules/sms/sms.module';
import { SinistrosModule } from './modules/sinistros/sinistros.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SegurosModule } from './modules/seguros/seguros.module';
import { ReportsModule } from './modules/reports/reports.module';
import { QueueModule } from './modules/queue/queue.module';
import { PdfModule } from './modules/pdf/pdf.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MultasModule } from './modules/multas/multas.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { FinanceiroModule } from './modules/financeiro/financeiro.module';
import { ExcelModule } from './modules/excel/excel.module';
import { EmailModule } from './modules/email/email.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule } from './modules/clients/clients.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { RentalsModule } from './modules/rentals/rentals.module';
import { InspectionsModule } from './modules/inspections/inspections.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ContractsModule,
    EmailModule,
    ExcelModule,
    FinanceiroModule,
    MaintenanceModule,
    MultasModule,
    NotificationsModule,
    PdfModule,
    QueueModule,
    ReportsModule,
    SegurosModule,
    SettingsModule,
    SinistrosModule,
    SmsModule,
    StorageModule,
    VistoriasModule,
    WhatsappModule,

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'], // SOMENTE apps/api/.env (sem contaminação!)
      cache: true,
      expandVariables: true,
    }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    ClientsModule,
    DriversModule,
    VehiclesModule,
    RentalsModule,
    InspectionsModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
