import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/users.entity';
import { LigneCommande } from '../lignecommande/lignecommande.entity';
import { Facture } from '../facture/facture.entity';

@Entity({ name: 'commande' })
export class Commande {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  numero_commande: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_creation: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  prix_total_ttc: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  prix_hors_taxe: number;

  @ManyToOne(() => User, (user) => user.commandes, { onDelete: 'SET NULL' })
  commercial: User;

  @OneToMany(() => LigneCommande, (ligneCommande) => ligneCommande.commande, { cascade: true })
  lignesCommande: LigneCommande[];
  // 🚀 Ajout de la relation avec Facture
  @OneToMany(() => Facture, (facture) => facture.commande, { cascade: true })
  factures: Facture[];
  @Column({ default: 'en_attente' })
statut: string;

}
