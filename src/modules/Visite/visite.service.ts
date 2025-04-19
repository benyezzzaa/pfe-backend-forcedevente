import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visite } from './visite.entity';
import { CreateVisiteDto } from './dto/create-visite.dto';
import { User } from '../users/users.entity';
import { Client } from '../client/client.entity';

@Injectable()
export class VisiteService {
  constructor(
    @InjectRepository(Visite)
    private visiteRepository: Repository<Visite>,

    @InjectRepository(Client)
    private clientRepository: Repository<Client>, // ✅ injecté ici
  ) {}

  async createVisite(dto: CreateVisiteDto, user: User): Promise<Visite> {
    // 🔍 Vérifier si le client existe
    const client = await this.clientRepository.findOneBy({ id: dto.clientId });
    if (!client) throw new NotFoundException('Client non trouvé.');

    // 🔨 Créer la visite avec client + commercial (user)
    const newVisite = this.visiteRepository.create({
      ...dto,
      user,
      client,
    });

    return await this.visiteRepository.save(newVisite);
  }

   // 👇 Cette méthode correspond à GET /visites/all
   async getAllVisites(): Promise<Visite[]> {
    return this.visiteRepository.find({
      relations: ['user', 'client', 'raison'], // assure-toi que raison est bien défini dans l'entité
      order: { id: 'ASC' },
    });
  }

  async getVisitesByCommercial(commercialId: number): Promise<Visite[]> {
    return await this.visiteRepository.find({
      where: { user: { id: commercialId } },
      relations: ['user', 'client'],
    });
  }

  async deleteVisite(id: number, user: User): Promise<void> {
    const visite = await this.visiteRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!visite) throw new NotFoundException('Visite non trouvée.');

    if (user.role !== 'admin' && visite.user.id !== user.id) {
      throw new ForbiddenException('Vous ne pouvez supprimer que vos propres visites.');
    }

    await this.visiteRepository.remove(visite);
  }
}
