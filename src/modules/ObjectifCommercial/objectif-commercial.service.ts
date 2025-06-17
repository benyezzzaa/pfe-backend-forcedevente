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
    private userRepo: Repository<User>,

    @InjectRepository(Commande)
    private commandeRepo: Repository<Commande>,
  ) {}

 async create(dto: CreateObjectifDto): Promise<ObjectifCommercial> {
  try {
    const commercial = await this.userRepo.findOneBy({ id: dto.commercialId });
    if (!commercial) throw new NotFoundException('Commercial non trouvé');

    const objectif = this.objectifRepo.create({
      ...dto,
      commercial,
    });

    return await this.objectifRepo.save(objectif);
  } catch (error) {
    console.error("❌ Erreur dans create objectif :", error);
    throw error;
  }
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

async getSalesByCategory(userId: number) {
  return this.commandeRepo
    .createQueryBuilder('commande')
    .leftJoin('commande.lignesCommande', 'ligne') // ✅ ici maintenant c'est correct
    .leftJoin('ligne.produit', 'produit')
    .leftJoin('produit.categorie', 'categorie')
    .select('categorie.nom', 'categorie')
    .addSelect('SUM(ligne.quantite)', 'totalQuantite')
    .where('commande.commercialId = :userId', { userId })
    .groupBy('categorie.nom')
    .getRawMany();
}

 async getProgressForAdmin() {
  const objectifs = await this.objectifRepo.find({ relations: ['commercial'] });

  const results: {
    id: number;
    commercial: User;
    categorie: string | undefined;
    objectif: number | undefined;
    realise: number;
    atteint: boolean;
  }[] = [];

  for (const obj of objectifs) {
    const ventes = await this.commandeRepo
      .createQueryBuilder('commande')
     .leftJoin('commande.lignesCommande', 'ligne') // ✅
      .leftJoin('ligne.produit', 'produit')
      .leftJoin('produit.categorie', 'categorie')
      .select('SUM(ligne.quantite)', 'total')
      .where('commande.commercialId = :id', { id: obj.commercial.id })
      .andWhere('categorie.nom = :cat', { cat: obj.categorieProduit })
      .getRawOne();

    const totalCat = parseFloat(ventes?.total || 0);

    const allVentes = await this.commandeRepo
      .createQueryBuilder('commande')
     .leftJoin('commande.lignesCommande', 'ligne') // ✅
      .where('commande.commercialId = :id', { id: obj.commercial.id })
      .select('SUM(ligne.quantite)', 'total')
      .getRawOne();

    const totalVentes = parseFloat(allVentes?.total || 1); // éviter division par 0

    const pourcentage = (totalCat / totalVentes) * 100;

    results.push({
      id: obj.id,
      commercial: obj.commercial,
      categorie: obj.categorieProduit,
      objectif: obj.pourcentageCible,
      realise: Number(pourcentage.toFixed(1)),
      atteint: obj.pourcentageCible ? pourcentage >= obj.pourcentageCible : false,
    });
  }

  return results;
}
async getObjectifsProgress(userId: number) {
  const objectifs = await this.objectifRepo.find({
    where: { commercial: { id: userId }, isActive: true },
    relations: ['commercial'],
  });

  const ventes = await this.getSalesByCategory(userId);
  const totalVentes = ventes.reduce((sum, v) => sum + parseFloat(v.totalQuantite), 0);

  return objectifs.map(obj => {
    const venteCat = ventes.find(v => v.categorie === obj.categorieProduit);
    const pourcentageReel = venteCat ? (venteCat.totalQuantite / totalVentes) * 100 : 0;
    return {
      id: obj.id,
      categorie: obj.categorieProduit,
      objectif: obj.pourcentageCible,
      realise: parseFloat(pourcentageReel.toFixed(1)),
      atteint: obj.pourcentageCible ? pourcentageReel >= obj.pourcentageCible : false,
    };
  });
}
async update(id: number, updateData: Partial<ObjectifCommercial>) {
    const objectif = await this.objectifRepo.findOneBy({ id });
    if (!objectif) throw new NotFoundException('Objectif introuvable');

    Object.assign(objectif, updateData);
    return this.objectifRepo.save(objectif);
  }

  async remove(id: number) {
    const objectif = await this.objectifRepo.findOneBy({ id });
    if (!objectif) throw new NotFoundException('Objectif introuvable');

    return this.objectifRepo.remove(objectif);
  }
}
