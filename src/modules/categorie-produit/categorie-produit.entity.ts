import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Produit } from '../produit/produit.entity';

@Entity({ name: 'categorie_produit' })
export class CategorieProduit {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'ID unique de la catégorie' })
  id: number;

  @Column({ unique: true, nullable: false })
  @ApiProperty({ example: 'Boissons', description: 'Nom de la catégorie de produit' })
  nom: string;

  @OneToMany(() => Produit, (produit) => produit.categorie)
  produits: Produit[];
}
