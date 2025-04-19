// promotion.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('promotion')
export class Promotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titre: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'float' })
  tauxReduction: number;

  @Column({ type: 'date' })
  dateDebut: Date;

  @Column({ type: 'date' })
  dateFin: Date;

  @Column({ default: true })
  isActive: boolean;
}
