import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';

@Entity({ name: 'client' }) // Vérifie que le nom correspond bien à ta BDD
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nom: string;

  @Column({ nullable: false })
  prenom: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  telephone: string;

  @Column({ nullable: false })
  adresse: string;

  @ManyToOne(() => User, (user) => user.clients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commercial_id' })
  commercial: User;
}
