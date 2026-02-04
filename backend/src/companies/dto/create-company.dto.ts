import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // 👈 Importar esto

export class CreateCompanyDto {
  @ApiProperty({
    example: 'Mi Pyme SpA',
    description: 'Nombre legal de la empresa',
  }) // 👈 Decorador Mágico
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '76.123.456-K', description: 'RUT o ID fiscal' })
  @IsString()
  @IsNotEmpty()
  tax_id: string;

  @ApiProperty({
    example: 'Venta de insumos',
    description: 'Rubro o descripción',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
