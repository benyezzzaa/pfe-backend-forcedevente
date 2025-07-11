import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../users/users.entity';
import { Commande } from '../commande/commande.entity';

@Entity({ name: 'client' }) // ✅ Vérifie que c'est bien `client` dans ta base
export class Client {
  @PrimaryGeneratedColumn()
  id: number;
@Column({ type: 'double precision', nullable: true })
latitude: number;

@Column({ type: 'double precision', nullable: true })
longitude: number;
  @Column({ nullable: false })
  nom: string;

  @Column({ nullable: false })
  prenom: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  telephone: string;
  @Column({ nullable: true })
  codeFiscale?: string;
  @Column({ nullable: false })
  adresse: string;
  @Column({ default: 3 })
  importance: number;
 // ✅ LA RELATION MANQUANTE
  @OneToMany(() => Commande, commande => commande.client)
  commandes: Commande[];
  // ✅ Cette relation est PARFAITE pour relier chaque client à son commercial
  @ManyToOne(() => User, (user) => user.clients, { 
    onDelete: 'CASCADE', 
    eager: true // 👈 AUTOMATIQUEMENT charger l'objet commercial (très important)
  })
  @JoinColumn({ name: 'commercial_id' }) // 👈 Dis à TypeORM que la clé est "commercial_id"
  commercial: User;
  @Column({ default: true })
isActive: boolean;
    surveys: any;

}
