import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Reglement } from '../reglement/reglement.entity';
import { Facture } from '../facture/facture.entity';

@Entity({ name: 'reglement_facture' }) // 📌 Nom correct de la table
export class ReglementFacture {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Reglement, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reglement_id' })
  reglement: Reglement;

  @ManyToOne(() => Facture, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'facture_id' })
  facture: Facture;
}
