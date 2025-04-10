import { IsOptional, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateLigneCommandeDto {
  @IsNumber()
  id: number; // ✅ ID obligatoire pour retrouver la ligne

  @IsOptional()
  @IsNumber()
  quantite?: number;
}

export class UpdateCommandeDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateLigneCommandeDto)
  lignesCommande?: UpdateLigneCommandeDto[];
}
