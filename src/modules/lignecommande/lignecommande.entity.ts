import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Commande } from '../commande/commande.entity';
import { Produit } from '../produit/produit.entity';

@Entity({ name: 'ligne_commande' }) // nom correct de ta table
export class LigneCommande {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  quantite: number;
  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  total: number; // ✅ Nouveau champ ajouté pour stocker total de la ligne (quantité * prix)


  @Column({ type: 'decimal', precision: 10, scale: 2    , nullable: false // Empêche les valeurs nulles
 })
  prixUnitaire: number;

  @ManyToOne(() => Commande, (commande) => commande.lignesCommande, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commande_id' })
  commande: Commande;

  @ManyToOne(() => Produit, (produit) => produit.lignesCommande, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'produit_id' })
  produit: Produit; // ✅ Produit associé
}
