// 📁 create-commande.dto.ts
import { IsString, IsArray, ValidateNested, IsNumber, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

class LigneCommandeDto {
  @IsNumber()
  produitId: number;

  @IsNumber()
  quantite: number;
}

export class CreateCommandeDto {
  @IsString()
  numeroCommande: string;

  @IsNumber()
  clientId: number; // ✅ Ajout ici

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LigneCommandeDto)
  lignesCommande: LigneCommandeDto[];
    @IsOptional()
  @IsInt()
  promotionId?: number;
}

