import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Produit } from '../produit/produit.entity';

@Entity({ name: 'unite' })
export class Unite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // ✅ Rendre `nom` unique pour éviter l'erreur de clé étrangère
  nom: string;

  @OneToMany(() => Produit, (produit) => produit.unite)
  produits: Produit[];
}
