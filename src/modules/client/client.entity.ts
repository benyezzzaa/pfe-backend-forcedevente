import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';

@Entity({ name: 'client' }) // ✅ Vérifie que c'est bien `client` dans ta base
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

  // ✅ Cette relation est PARFAITE pour relier chaque client à son commercial
  @ManyToOne(() => User, (user) => user.clients, { 
    onDelete: 'CASCADE', 
    eager: true // 👈 AUTOMATIQUEMENT charger l'objet commercial (très important)
  })
  @JoinColumn({ name: 'commercial_id' }) // 👈 Dis à TypeORM que la clé est "commercial_id"
  commercial: User;
}
