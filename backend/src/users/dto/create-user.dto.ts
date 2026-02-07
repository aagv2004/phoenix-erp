import {
  IsEmail,
  IsString,
  MinLength,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'juan.perez@phoenix.cl',
    description: 'Correo único del usuario',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Secret123!',
    description: 'Contraseña segura (mínimo 6 caracteres)',
  })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario',
  })
  @IsString()
  @MinLength(1)
  fullName: string;

  @ApiProperty({
    example: ['user', 'admin'],
    description: 'Roles del sistema',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}
