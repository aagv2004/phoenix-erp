import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    // TypeORM: create crea la instancia, save la guarda en BD
    const company = this.companyRepository.create(createCompanyDto);
    return await this.companyRepository.save(company);
  }

  findAll() {
    return this.companyRepository.find();
  }

  async findOne(id: string) {
    const company = await this.companyRepository.findOneBy({ id });
    if (!company) throw new NotFoundException(`Company #${id} not found`);
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    // Preload busca si existe y le parcha los datos nuevos
    const company = await this.companyRepository.preload({
      id: id,
      ...updateCompanyDto,
    });

    if (!company) throw new NotFoundException(`Company #${id} not found`);

    return this.companyRepository.save(company);
  }

  async remove(id: string) {
    const company = await this.findOne(id); // Reutilizamos findOne para validar
    return this.companyRepository.remove(company);
  }
}
