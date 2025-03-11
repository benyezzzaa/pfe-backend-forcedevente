import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Produit } from '../produit/produit.entity';

@Entity({ name: 'categorie_produit' }) // Correspond au nom de la table
export class CategorieProduit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // 🔥 S'assure que "nom" est unique
  nom: string;

  @OneToMany(() => Produit, (produit) => produit.categorie)
  produits: Produit[];
}
