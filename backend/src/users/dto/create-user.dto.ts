import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/roles.enum';

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
  full_name: string;

  @ApiProperty({
    example: UserRole.EMPLEADO,
    description: 'Rol del usuario en el sistema',
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, {
    message: 'El rol debe ser uno de los valores permitidos',
  })
  role?: UserRole;
}
