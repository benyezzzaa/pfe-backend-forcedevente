import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { CreateClientDto } from './DTO/create-client.dto';
import { User } from '../users/users.entity'; // ✅ Import de `User`

@Injectable()
export class ClientService {
    constructor(
      @InjectRepository(Client) // ✅ Corrigé ici (majuscule)
      private clientRepository: Repository<Client>,
    ) {}

  async createClient(dto: CreateClientDto, commercial: User): Promise<Client> {
    if (commercial.role !== 'commercial') {
      throw new ForbiddenException('Seuls les commerciaux peuvent ajouter des clients.');
    }

    const newClient = this.clientRepository.create({ ...dto, commercial });
    return await this.clientRepository.save(newClient as Client);
  }

  async getAllClients(): Promise<Client[]> {
    return await this.clientRepository.find({ relations: ['commercial'] });
  }

  async getClientById(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['commercial'],
    });
    if (!client) throw new NotFoundException('Client non trouvé.');
    return client;
  }

  async updateClient(id: number, dto: CreateClientDto, commercial: User): Promise<Client> {
    const client = await this.clientRepository.findOne({
        where: { id, commercial: commercial }, // ✅ Correction
        relations: ['commercial'],
      });
    if (!client) throw new NotFoundException('Client non trouvé.');

    Object.assign(client, dto);
    return await this.clientRepository.save(client as Client);
  }

  async deleteClient(id: number, commercial: User): Promise<void> {
    const client = await this.clientRepository.findOne({
      where: { id, commercial: { id: commercial.id } }, // ✅ Correction
      relations: ['commercial'],
    });
    if (!client) throw new NotFoundException('Client non trouvé.');

    await this.clientRepository.remove(client);
  }
}
