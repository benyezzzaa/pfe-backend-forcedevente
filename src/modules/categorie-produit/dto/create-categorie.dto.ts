import { ApiProperty } from '@nestjs/swagger';

export class CreateCategorieDto {
  @ApiProperty({ example: 'Boissons', description: 'Nom de la catégorie de produit' })
  nom: string;
}
