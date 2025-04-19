// ✅ DTO - create-produit.dto.ts
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProduitDto {
  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  prix: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  stock: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  prix_unitaire: number;

  @IsNotEmpty()
  @IsString()
  categorieId: string;

  @IsNotEmpty()
  @IsString()
  uniteId: string; // ⚠️ string car c'est le nom de l'unité
}
