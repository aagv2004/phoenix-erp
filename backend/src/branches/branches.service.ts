import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from './entities/branch.entity';
import { Company } from '../companies/entities/company.entity';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createBranchDto: CreateBranchDto) {
    // 1. Buscamos la empresa papá
    const company = await this.companyRepository.findOneBy({
      id: createBranchDto.companyId,
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // 2. Creamos la sucursal y le asignamos la empresa
    const branch = this.branchRepository.create({
      name: createBranchDto.name,
      address: createBranchDto.address,
      company: company, // <--- Aquí se hace la relación
    });

    // 3. Guardamos
    return this.branchRepository.save(branch);
  }

  findAll() {
    // relations: ['company'] hace que te traiga los datos de la empresa también
    return this.branchRepository.find({ relations: ['company'] });
  }

  async findOne(id: string) {
    const branch = await this.branchRepository.findOne({
      where: { id },
      relations: ['company'],
    });
    if (!branch) throw new NotFoundException('Branch not found');
    return branch;
  }

  update(id: string, updateBranchDto: UpdateBranchDto) {
    // Por ahora dejemos el update genérico
    return this.branchRepository.update(id, updateBranchDto);
  }

  async remove(id: string) {
    const result = await this.branchRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Branch not found');
    return { deleted: true };
  }
}
