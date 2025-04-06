import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { CreateClientDto } from './DTO/create-client.dto';
import { User } from '../users/users.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  // ✅ Ajouter un client
  async createClient(dto: CreateClientDto, commercial: User): Promise<Client> {
    if (commercial.role !== 'commercial') {
      throw new ForbiddenException('Seuls les commerciaux peuvent ajouter des clients.');
    }

    const newClient = this.clientRepository.create({ 
      ...dto, 
      commercial 
    });
    return await this.clientRepository.save(newClient);
  }

  // ✅ Obtenir tous les clients
  async getAllClients(): Promise<Client[]> {
    return await this.clientRepository.find();
    // ⛔ PAS besoin de { relations: ['commercial'] } car tu as mis eager: true dans l'entité
  }

  // ✅ Obtenir un client par ID
  async getClientById(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) throw new NotFoundException('Client non trouvé.');
    return client;
  }

  // ✅ Mettre à jour un client
  async updateClient(id: number, dto: CreateClientDto, commercial: User): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id, commercial: { id: commercial.id } }, 
    });
    if (!client) throw new NotFoundException('Client non trouvé.');

    Object.assign(client, dto);
    return await this.clientRepository.save(client);
  }

  // ✅ Supprimer un client
  async deleteClient(id: number, commercial: User): Promise<void> {
    const client = await this.clientRepository.findOne({
      where: { id, commercial: { id: commercial.id } },
    });
    if (!client) throw new NotFoundException('Client non trouvé.');

    await this.clientRepository.remove(client);
  }
}
