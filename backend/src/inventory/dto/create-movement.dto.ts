import {
  IsUUID,
  IsNumber,
  IsEnum,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MovementType } from '../enums/movement-type.enum';

export class CreateMovementDto {
  @IsEnum(MovementType)
  type: MovementType;

  @IsUUID()
  productId: string;

  @IsUUID()
  branchId: string;

  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  quantity: number;

  @IsOptional()
  @IsString()
  notes?: string;

  // 👇 Este campo NO viene del body, se agrega automáticamente desde el token JWT
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  relatedBranchId?: string; // Para transferencias
}
