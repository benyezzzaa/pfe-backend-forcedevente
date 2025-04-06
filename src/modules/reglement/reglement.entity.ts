import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Facture } from '../facture/facture.entity';
import { TypeReglement } from '../type-reglement/typeReglement.entity';
import { ReglementFacture } from '../reglement-facture/reglement-facture.entity';

@Entity({ name: 'reglement' })
export class Reglement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'montant_paye', type: 'double precision', nullable: false })
  montantPaye: number;

  @Column({ name: 'date_paiement', type: 'date', nullable: false })
  datePaiement: Date;

  @Column({ type: 'varchar', length: 50, nullable: false })
  statut: string;

  @ManyToOne(() => Facture, (facture) => facture.reglements, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'facture_id' })
  facture: Facture;

  @ManyToOne(() => TypeReglement, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'type_reglement_id' })
  typeReglement?: TypeReglement; // ✅ Accept `null`
  @OneToMany(() => ReglementFacture, (reglementFacture) => reglementFacture.reglement)
reglementsFactures: ReglementFacture[];
}
