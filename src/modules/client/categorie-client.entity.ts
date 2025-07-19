// src/modules/client/categorie-client.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Client } from './client.entity';

@Entity()
export class CategorieClient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @OneToMany(() => Client, (client) => client.categorie)
  clients: Client[];
}
