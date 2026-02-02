import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(5)
  address: string;

  @IsUUID()
  companyId: string; // <--- EL ESLABÓN PERDIDO 🔗
}
