import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectifCommercial } from './objectif-commercial.entity';

import { User } from '../users/users.entity';
import { CreateObjectifDto } from './DTO/create-objectif.dto';
import { Commande } from '../commande/commande.entity';

@Injectable()
export class ObjectifCommercialService {
  constructor(
  @InjectRepository(ObjectifCommercial)
  private objectifRepo: Repository<ObjectifCommercial>,

  @InjectRepository(User)
  private userRepo: Repository<User>, // ✅ VIRGULE ICI

  @InjectRepository(Commande)
  private commandeRepo: Repository<Commande>,
) {}
  async getSalesByCategory(userId: number) {
  return this.commandeRepo
    .createQueryBuilder('commande')
    .leftJoin('commande.lignes', 'ligne')
    .leftJoin('ligne.produit', 'produit')
    .leftJoin('produit.categorie', 'categorie')
    .select('categorie.nom', 'categorie')
    .addSelect('SUM(ligne.quantite)', 'totalQuantite')
    .where('commande.commercialId = :userId', { userId })
    .groupBy('categorie.nom')
    .getRawMany();
}
async getByCommercialGroupedByYear(userId: number) {
  const objectifs = await this.objectifRepo.find({
    where: { commercial: { id: userId } },
    relations: ['commercial'],
  });

  const grouped = objectifs.reduce((acc, obj) => {
    const year = new Date(obj.dateDebut).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(obj);
    return acc;
  }, {});
  
  return grouped;
}

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