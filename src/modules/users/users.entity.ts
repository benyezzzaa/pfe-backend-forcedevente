import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Client } from '../client/client.entity';

import { Visite } from '../Visite/visite.entity';
import { Commande } from '../commande/commande.entity';
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
  @OneToMany(() => Client, (client) => client.commercial, { cascade: true })
clients: Client[];
  // ✅ Ajoute cette relation avec `Visite`
  @OneToMany(() => Visite, (visite) => visite.user)
  visites: Visite[];
   // ✅ Ajout de la relation avec `Commande`
   @OneToMany(() => Commande, (commande) => commande.commercial)
   commandes: Commande[];
   @Column({ default: true })
isActive: boolean;


}
