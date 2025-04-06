import { ApiProperty } from '@nestjs/swagger';

export class LigneCommandeDto {
  @ApiProperty({ example: 1, description: 'Identifiant de la ligne de commande' })
  id: number;

  @ApiProperty({ example: 'CMD1234', description: 'Numéro de la commande associée' })
  numero_commande: string;

  @ApiProperty({ example: 'Produit 1', description: 'Nom du produit' })
  nom_produit: string;

  @ApiProperty({ example: 5, description: 'Quantité commandée' })
  quantite: number;

  @ApiProperty({ example: 25.50, description: 'Prix unitaire du produit' })
  prix_unitaire: number;
}
