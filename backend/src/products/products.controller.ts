import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserRole } from '../users/enums/roles.enum';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.DIRECTOR, UserRole.GERENTE)
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser('id') userId: string, // 👈 Extraer el ID del usuario autenticado
  ) {
    // Agregar automáticamente el usuario que creó el producto
    return this.productsService.create({
      ...createProductDto,
      created_by: userId,
    });
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.DIRECTOR, UserRole.GERENTE)
  update(@Param('id') id: string, @Body() updateProductDto: any) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.DIRECTOR)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
