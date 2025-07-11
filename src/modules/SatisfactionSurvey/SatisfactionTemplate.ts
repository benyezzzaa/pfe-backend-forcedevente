import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class SatisfactionTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'text' })
  description: string;

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

  @CreateDateColumn()
  createdAt: Date;
}
