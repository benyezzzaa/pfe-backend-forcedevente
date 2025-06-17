import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/users.entity';
import { LigneCommande } from '../lignecommande/lignecommande.entity';
import { Facture } from '../facture/facture.entity';
import { Client } from '../client/client.entity';
import { Produit } from '../produit/produit.entity';

@Entity({ name: 'commande' })
export class Commande {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  numero_commande: string;

 @Column({ 
    name: 'date_creation',
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP' 
  })
  dateCreation: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  prix_total_ttc: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  prix_hors_taxe: number;
@OneToMany(() => LigneCommande, ligne => ligne.commande, { cascade: true })
lignesCommande: LigneCommande[];
  @ManyToOne(() => User, (user) => user.commandes, { onDelete: 'SET NULL' })
  commercial: User;
@ManyToOne(() => Client, client => client.commandes, { eager: true })
client: Client;
@ManyToOne(() => Produit, (produit) => produit.lignesCommande, { eager: true })
produit: Produit;

  // 🚀 Ajout de la relation avec Facture
  @OneToMany(() => Facture, (facture) => facture.commande, { cascade: true })
  factures: Facture[];
  @Column({ default: 'en_attente' })
statut: string;

}
