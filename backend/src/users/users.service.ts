import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'; // 👈 El cerrajero

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // 1. Desestructurar para sacar la contraseña plana
      const { password, ...userData } = createUserDto;

      // 2. Encriptar la contraseña (10 vueltas de sal)
      // Esto convierte "hola123" en "$2b$10$EixZaYVK1fs..."
      const hashedPassword = bcrypt.hashSync(password, 10);

      // 3. Crear el objeto usuario
      const user = this.userRepository.create({
        ...userData,
        password: hashedPassword, // Guardamos la encriptada
      });

      // 4. Guardar en DB
      await this.userRepository.save(user);

      // 5. Limpiar el retorno (para no enviar el hash al frontend)
      const { password: _pwd, ...userWithoutPassword } = user;

      return userWithoutPassword;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  // --- CRUD BÁSICO ---

  findAll() {
    return this.userRepository.find({
      // Ojo: Por defecto la entity tiene 'select: false' en password,
      // así que aquí no viajará la contraseña. ¡Seguro!
    });
  }

  async findOne(id: string) {
    // Usamos findOne con relations en lugar de findOneBy
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['company', 'branch'], // Traemos la data de las tablas vinculadas
    });

    if (!user) throw new BadRequestException('Usuario no encontrado');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...toUpdate } = updateUserDto;

    const user = await this.userRepository.preload({
      id: id,
      ...toUpdate,
    });

    if (!user)
      throw new BadRequestException(`Usuario con id ${id} no encontrado`);

    if (password) {
      user.password = bcrypt.hashSync(password, 10);
    }

    try {
      await this.userRepository.save(user);

      const { password: _pwd, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { message: 'Usuario eliminado correctamente' };
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password',
        'role',
        'full_name',
        'isActive',
        'company_id',
        'branch_id',
      ],
    });

    return user;
  }

  async findOneWithCompany(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['company', 'branch'],
    });
    if (!user)
      throw new BadRequestException(
        'Usuario no encontrado o sin empresa asignada',
      );
    return user;
  }

  async findProfileById(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['company', 'branch'],
    });
  }

  // Manejo de errores centralizado (por si el email ya existe)
  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      // Código de PostgreSQL para "Unique Constraint"
      throw new BadRequestException('El correo electrónico ya está registrado');
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Error inesperado, revisa los logs del servidor',
    );
  }
}
