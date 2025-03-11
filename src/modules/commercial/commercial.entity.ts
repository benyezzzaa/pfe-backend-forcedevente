import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Commercial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  email: string;

  @Column()
  tel: string;
}
