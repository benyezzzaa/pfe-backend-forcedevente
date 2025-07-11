import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { Client } from '../client/client.entity';

@Entity()
export class Satisfaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  commercial: User;

  @ManyToOne(() => Client)
  client: Client;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  noteGlobale: number;

  @Column({ nullable: true })
  serviceCommercial: number;

  @Column({ nullable: true })
  livraison: number;

  @Column({ nullable: true })
  gammeProduits: boolean;

  @Column({ nullable: true })
  recommandation: boolean;

  @Column({ nullable: true, type: 'text' })
  commentaire: string;

  @CreateDateColumn()
  createdAt: Date;
}
