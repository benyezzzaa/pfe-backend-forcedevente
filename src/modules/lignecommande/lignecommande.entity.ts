import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Commande } from '../commande/commande.entity';
import { Produit } from '../produit/produit.entity';

@Entity({ name: 'ligne_commande' })
export class LigneCommande {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  quantite: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  prixUnitaire: number;

  @ManyToOne(() => Commande, (commande) => commande.lignesCommande, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commande_id' })
  commande: Commande;

  @ManyToOne(() => Produit, { eager: true })
  @JoinColumn({ name: 'produit_id' })
  produit: Produit;
}
