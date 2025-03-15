import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';

@Entity({ name: 'visite' }) // Assure-toi que le nom correspond à la table PostgreSQL
export class Visite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'text', nullable: false })
  raison: string;

  @ManyToOne(() => User, (user) => user.visites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // Clé étrangère pour savoir qui a ajouté la visite
  user: User;
}
