import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly usersService: UsersService,
  ) {}

  async create(createProductDto: CreateProductDto, userId: string) {
    const user = await this.usersService.findOneWithCompany(userId);

    if (!user.company?.id) {
      throw new BadRequestException('El usuario no tiene empresa asignada');
    }

    const product = this.productRepository.create({
      ...createProductDto,
      company: { id: user.company_id } as any,
    });
    return await this.productRepository.save(product);
  }

  async findAll() {
    return await this.productRepository.find({ relations: ['company'] });
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['company'],
    });
    if (!product)
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    return product;
  }
}
