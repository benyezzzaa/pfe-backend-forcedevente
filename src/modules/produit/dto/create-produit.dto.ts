import { ApiProperty } from '@nestjs/swagger';

export class CreateProduitDto {
  @ApiProperty({ example: 'Oeufs Bio', description: 'Nom du produit' })
  nom: string;

  @ApiProperty({ example: 'Oeufs frais biologiques', description: 'Description du produit' })
  description: string;

  @ApiProperty({ example: 10.99, description: 'Prix du produit' })
  prix: number;

  @ApiProperty({ example: 100, description: 'Quantité en stock' })
  stock: number;

  @ApiProperty({ example: 'Produits Laitiers', description: 'Nom de la catégorie' })
  categorieId: string; // 🔥 Stocke le nom de la catégorie

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, required: false }) // 📂 Pour Swagger
  images?: string[];
  @ApiProperty({ example: 'Plastique', description: 'Nom de l\'unité' }) // ✅ `uniteId` devient un `string`
  uniteId: string;
}
