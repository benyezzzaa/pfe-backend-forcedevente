import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectifCommercial } from './objectif-commercial.entity';

import { User } from '../users/users.entity';
import { CreateObjectifDto } from './DTO/create-objectif.dto';

@Injectable()
export class ObjectifCommercialService {
  constructor(
    @InjectRepository(ObjectifCommercial)
    private objectifRepo: Repository<ObjectifCommercial>,
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  async create(dto: CreateObjectifDto): Promise<ObjectifCommercial> {
    const commercial = await this.userRepo.findOneBy({ id: dto.commercialId });
    if (!commercial) throw new NotFoundException('Commercial non trouvé');

    const objectif = this.objectifRepo.create({
      ...dto,
      commercial
    });
    return this.objectifRepo.save(objectif);
  }

  findAll(): Promise<ObjectifCommercial[]> {
    return this.objectifRepo.find({ relations: ['commercial'] });
  }

  async toggleStatus(id: number): Promise<ObjectifCommercial> {
    const obj = await this.objectifRepo.findOneBy({ id });
    if (!obj) throw new NotFoundException('Objectif introuvable');
    obj.isActive = !obj.isActive;
    return this.objectifRepo.save(obj);
  }
}