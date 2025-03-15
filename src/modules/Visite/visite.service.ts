import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visite } from './visite.entity';
import { CreateVisiteDto } from './dto/create-visite.dto';
import { User } from '../users/users.entity';

@Injectable()
export class VisiteService {
  constructor(
    @InjectRepository(Visite)
    private visiteRepository: Repository<Visite>,
  ) {}

  async createVisite(dto: CreateVisiteDto, user: User): Promise<Visite> {
    if (user.role !== 'commercial') {
      throw new ForbiddenException('Seuls les commerciaux peuvent ajouter des visites.');
    }

    const newVisite = this.visiteRepository.create({ ...dto, user });
    return await this.visiteRepository.save(newVisite);
  }

  async getAllVisites(): Promise<Visite[]> {
    return await this.visiteRepository.find({ relations: ['user'] });
  }

  async getVisitesByCommercial(commercialId: number): Promise<Visite[]> {
    return await this.visiteRepository.find({ where: { user: { id: commercialId } }, relations: ['user'] });
  }

  async deleteVisite(id: number, user: User): Promise<void> {
    const visite = await this.visiteRepository.findOne({ where: { id }, relations: ['user'] });
    if (!visite) throw new NotFoundException('Visite non trouvée.');

    if (user.role !== 'admin' && visite.user.id !== user.id) {
      throw new ForbiddenException('Vous ne pouvez supprimer que vos propres visites.');
    }

    await this.visiteRepository.remove(visite);
  }
}
