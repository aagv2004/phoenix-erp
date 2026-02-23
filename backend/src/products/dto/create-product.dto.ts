import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  MinLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  sku: string;

  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  min_stock?: number;

  @IsUUID()
  company_id: string;

  // 👇 Este campo NO viene del body, se agrega automáticamente
  @IsOptional()
  @IsUUID()
  created_by?: string;
}
