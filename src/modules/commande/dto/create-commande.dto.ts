// src/modules/commande/dto/create-commande.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommandeDto {
  @ApiProperty({ example: 'CMD1234' })
  numeroCommande: string;

  @ApiProperty({ example: 100.5 })
  prixTotalTTC: number;

  @ApiProperty({ example: 95 })
  prixHorsTaxe: number;

  @ApiProperty({ type: () => [LigneCommandeCreateDto] })
  lignesCommande: LigneCommandeCreateDto[]; // 🔥
}

export class LigneCommandeCreateDto {
  @ApiProperty({ example: 1 })
  produitId: number;

  @ApiProperty({ example: 5 })
  quantite: number;
}
