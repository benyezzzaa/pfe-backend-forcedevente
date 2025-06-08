import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
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

  // ✅ Ajouter un client (Commercial uniquement)
  async createClient(dto: CreateClientDto, user: User): Promise<Client> {
    if (user.role !== 'commercial') {
      throw new ForbiddenException('Seuls les commerciaux peuvent ajouter des clients.');
    }

    const client = this.clientRepository.create({
      ...dto,
      commercial: user,
    });

    return this.clientRepository.save(client);
  }

  // ✅ Voir tous les clients
  async getAllClients(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  // ✅ Voir un client spécifique
async getClientById(id: number): Promise<Client> {
  if (typeof id !== 'number' || isNaN(id)) {
    throw new BadRequestException('ID invalide');
  }

  const client = await this.clientRepository.findOne({ where: { id }, relations: ['commercial'] });
  if (!client) {
    throw new NotFoundException(`Client avec l'id ${id} non trouvé.`);
  }

  return client;
}

  // ✅ Modifier un client
async updateClient(id: number, dto: CreateClientDto, user: User): Promise<Client> {
  const client = await this.getClientById(id);

  if (user.role === 'commercial' && client.commercial?.id !== user.id) {
    throw new ForbiddenException('Vous ne pouvez modifier que vos propres clients.');
  }

  Object.assign(client, dto);
  return this.clientRepository.save(client);
}

  // ✅ Supprimer un client
  async deleteClient(id: number, user: User): Promise<{ message: string }> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) throw new NotFoundException('Client non trouvé.');

    if (user.role === 'commercial' && client.commercial?.id !== user.id) {
      throw new ForbiddenException('Vous ne pouvez supprimer que vos propres clients.');
    }

    await this.clientRepository.remove(client);
    return { message: 'Client supprimé avec succès.' };
  }

  // ✅ Activer / Désactiver un client
  async updateClientStatus(id: number, isActive: boolean, user: User): Promise<{ message: string; client: Client }> {
  const client = await this.getClientById(id);

  if (user.role === 'commercial' && client.commercial?.id !== user.id) {
    throw new ForbiddenException('Vous ne pouvez modifier que vos propres clients.');
  }

  client.isActive = isActive;
  const updated = await this.clientRepository.save(client);

  return {
    message: `Client ${isActive ? 'activé' : 'désactivé'} avec succès.`,
    client: updated,
  };
}

async getClientsDuCommercial(user: User): Promise<Client[]> {
  if (!user || !user.id) {
    throw new BadRequestException('Utilisateur non authentifié');
  }

  return this.clientRepository.find({
    where: { commercial: { id: user.id } },
    relations: ['commercial'],
  });
}
} 
