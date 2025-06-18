import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';

@Entity('objectif_commercial')
export class ObjectifCommercial {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'commercial_id' })
  commercial: User;

  @Column({ type: 'date' })
  dateDebut: Date;

  @Column({ type: 'date' })
  dateFin: Date;

  

  @Column({ nullable: true })
  categorieProduit?: string;

  @Column({ type: 'float', default: 0 })
  prime: number;

  @Column({ nullable: true })
  mission?: string;

  @Column({ type: 'float', nullable: true })
  bonus?: number;
@Column({ type: 'float', nullable: true })
pourcentageCible?: number; // Par exemple : 30 pour 30%
  @Column({ default: true })
  isActive: boolean;
}