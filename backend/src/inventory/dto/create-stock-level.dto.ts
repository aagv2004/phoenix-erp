import { IsUUID, IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStockLevelDto {
  @IsUUID()
  productId: string;

  @IsUUID()
  branchId: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  quantity: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minStock?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxStock?: number;
}
