import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { Company } from '../companies/entities/company.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Branch, Company, User])],
  controllers: [BranchesController],
  providers: [BranchesService],
})
export class BranchesModule {}
