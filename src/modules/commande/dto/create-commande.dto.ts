// src/modules/commande/dto/create-commande.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';

export class CreateCommandeDto {
  @ApiProperty({ example: 'CMD1234' })
  @IsString()
  numeroCommande: string; // ✅ DOIT être camelCase (comme Swagger)

  @ApiProperty({ example: 100.5 })
  @IsNumber()
  prixTotalTTC: number;

  @ApiProperty({ example: 95 })
  @IsNumber()
  prixHorsTaxe: number;

  @ApiProperty({ type: () => [LigneCommandeCreateDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LigneCommandeCreateDto)
  lignesCommande: LigneCommandeCreateDto[];
}

export class LigneCommandeCreateDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  produitId: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  quantite: number;
}
