import { IsString, IsUUID, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBranchDto {
  @ApiProperty({
    example: 'Mi sucursal principal',
    description: 'Nombre legal de la sucursal',
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    example: 'Av. Siempre Viva 123',
    description: 'Dirección física de la sucursal',
  })
  @IsString()
  @MinLength(5)
  address: string;

  @ApiProperty({
    example: 'b1a2c3d4-e5f6-7890-ab12-cd34ef56gh78',
    description: 'ID de la empresa a la que pertenece esta sucursal',
  })
  @IsUUID()
  companyId: string;
}
