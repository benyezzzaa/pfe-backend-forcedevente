import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'users' }) // 🔥 Vérifie bien que la table s'appelle `users`
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false }) // 🔥 Empêche les valeurs NULL
  nom: string;

  @Column({ nullable: false })
  prenom: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  tel: string;

  @Column({ type: 'enum', enum: ['commercial', 'admin', 'bo'], default: 'commercial' })
  role: string;
}
