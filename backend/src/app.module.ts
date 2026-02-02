import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompaniesModule } from './companies/companies.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, CompaniesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
