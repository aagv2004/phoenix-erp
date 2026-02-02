import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      // Usamos 'this.prisma.companies' (coincide con tu schema)
      return await this.prisma.companies.create({
        data: {
          name: createCompanyDto.name,
          // Mapeo directo: DTO (snake_case) -> Base de Datos (snake_case)
          tax_id: createCompanyDto.tax_id,
          description: createCompanyDto.description,
        },
      });
    } catch (error) {
      // Si el error es P2002, es violación de campo único (ej: RUT repetido si fuera unique)
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe una empresa con ese RUT/ID');
      }
      // Log del error real en consola para debug
      console.error(error);
      throw new InternalServerErrorException('Error creando la empresa');
    }
  }

  async findAll() {
    return await this.prisma.companies.findMany();
  }

  async findOne(id: string) {
    const company = await this.prisma.companies.findUnique({
      where: { id },
    });
    if (!company)
      throw new NotFoundException(`La empresa con ID ${id} no existe`);
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.findOne(id);

    try {
      return await this.prisma.companies.update({
        where: { id },
        data: {
          name: updateCompanyDto.name,
          tax_id: updateCompanyDto.tax_id,
          description: updateCompanyDto.description,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error actualizando la empresa',
        error,
      );
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.companies.delete({
      where: { id },
    });
  }
}
