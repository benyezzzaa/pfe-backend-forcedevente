import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Reglement } from '../reglement/reglement.entity';
import { Facture } from '../facture/facture.entity';

@Entity({ name: 'reglement_facture' }) // 📌 Ce nom doit correspondre à ta base de données
export class ReglementFacture {
  @PrimaryGeneratedColumn()
  id: number;

  // Relation avec la table Reglement
  @ManyToOne(() => Reglement, (reglement) => reglement.reglementsFactures, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reglement_id' })
  reglement: Reglement;

  // Relation avec la table Facture
  @ManyToOne(() => Facture, (facture) => facture.reglementsFactures, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'facture_id' })
  facture: Facture;
}
