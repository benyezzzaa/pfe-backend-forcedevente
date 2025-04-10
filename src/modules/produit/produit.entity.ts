import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CategorieProduit } from '../categorie-produit/categorie-produit.entity';
import { Unite } from '../unite/unite.entity';
import { LigneCommande } from '../lignecommande/lignecommande.entity';
@Entity({ name: 'produit' })
export class Produit {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: true })
isActive: boolean;
  @Column({ nullable: false })
  nom: string;

  @Column({ nullable: false })
  description: string;

  @Column({ type: 'double precision', nullable: false })
  prix: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column("text", { array: true, nullable: true })
  images: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
prix_unitaire: number;

  @Column({ type: 'varchar', nullable: false }) // ✅ Vérifie que c'est bien NOT NULL
  categorieId: string;

  @ManyToOne(() => CategorieProduit, (categorie) => categorie.produits, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: 'categorieId', referencedColumnName: 'nom' }) // ✅ Vérifie que la référence est correcte
  categorie: CategorieProduit;
  // 🔹 Relation avec l'unité (Plastique, Carton, etc.)
  @Column({ type: 'varchar', nullable: false }) // ✅ Changer en `varchar` au lieu de `int`
  uniteId: string;
  @ManyToOne(() => Unite, (unite) => unite.produits, { eager: true }) 
  @JoinColumn({ name: 'uniteId', referencedColumnName: 'nom' }) // ✅ Associer à `nom` au lieu de `id`
  unite: Unite;
  @OneToMany(() => LigneCommande, (ligneCommande) => ligneCommande.produit)
  lignesCommande: LigneCommande[]; // ✅ Ajoute ceci pour corriger ton erreur aussi
}
