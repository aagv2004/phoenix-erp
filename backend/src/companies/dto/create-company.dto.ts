import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCompanyDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsString({ message: 'El RUT/Tax ID debe ser un texto' })
  @IsOptional()
  tax_id?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
