import { ApiProperty } from '@nestjs/swagger';

export class CreateCommandeDto {
  @ApiProperty({ example: 'CMD-2025001', description: 'Numéro unique de la commande' })
  numeroCommande: string;

  @ApiProperty({ example: 250.99, description: 'Prix total TTC' })
  prixTotalTTC: number;

  @ApiProperty({ example: 210.00, description: 'Prix hors taxe' })
  prixHorsTaxe: number;
}
