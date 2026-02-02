import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Usamos TypeORM
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { Company } from './entities/company.entity'; // <--- Importamos la entidad

@Module({
  imports: [TypeOrmModule.forFeature([Company])], // <--- Cargamos el repositorio de Company
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [TypeOrmModule], // (Opcional) Por si alguien más necesita este repo
})
export class CompaniesModule {}
