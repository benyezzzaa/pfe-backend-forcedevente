// ✅ DTO - create-produit.dto.ts
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
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
  @Min(0, { message: 'Le prix doit être supérieur ou égal à 0.' })
  prix: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  stock: number;

 @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Le prix unitaire doit être supérieur ou égal à 0.' })
  prix_unitaire: number;

  @IsNotEmpty()
  @IsString()
  categorieId: string;

  @IsNotEmpty()
  @IsString()
  uniteId: string; // ⚠️ string car c'est le nom de l'unité
}
