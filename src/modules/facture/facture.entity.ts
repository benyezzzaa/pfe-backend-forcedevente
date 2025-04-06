import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Commande } from '../commande/commande.entity';
import { Reglement } from '../reglement/reglement.entity';


@Entity({ name: 'facture' })
export class Facture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  prixTotal: number;

  @ManyToOne(() => Commande, (commande) => commande.factures, { onDelete: 'CASCADE' })
  commande: Commande;

  @OneToMany(() => Reglement, (reglement) => reglement.facture)
  reglements: Reglement[];
}
