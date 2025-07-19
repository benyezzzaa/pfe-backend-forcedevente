import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectifCommercial } from './objectif-commercial.entity';
import { User } from '../users/users.entity';
import { CreateObjectifDto, CreateObjectifGlobalDto } from './DTO/create-objectif.dto';
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
    if (!dto.commercialId) {
      throw new BadRequestException('commercialId est requis pour un objectif individuel');
    }

    const user = await this.userRepo.findOneByOrFail({ id: dto.commercialId });

    const objectif = this.objectifRepo.create({
      commercial: user,
      montantCible: dto.montantCible,
      prime: dto.prime,
      mission: dto.mission || `Vendre pour ${dto.montantCible} €`,
      dateDebut: dto.dateDebut,
      dateFin: dto.dateFin,
      totalVentes: 0,
      isActive: true,
    });
    return this.objectifRepo.save(objectif);
  }

  async createGlobal(createDto: CreateObjectifGlobalDto): Promise<ObjectifCommercial> {
    const objectif = this.objectifRepo.create({
      commercial: null, // Objectif global sans commercial spécifique
      dateDebut: new Date(createDto.dateDebut),
      dateFin: new Date(createDto.dateFin),
      montantCible: createDto.montantCible,
      prime: createDto.prime,
      mission: createDto.mission || `Objectif global: ${createDto.montantCible} €`,
      totalVentes: 0,
      isActive: true,
    });
    return this.objectifRepo.save(objectif);
  }

  async findAll(): Promise<ObjectifCommercial[]> {
    return this.objectifRepo.find({
      relations: ['commercial'],
      order: { id: 'DESC' },
    });
  }

  async toggleStatus(id: number): Promise<ObjectifCommercial> {
    const obj = await this.objectifRepo.findOneBy({ id });
    if (!obj) throw new NotFoundException('Objectif introuvable');
    obj.isActive = !obj.isActive;
    return this.objectifRepo.save(obj);
  }

  async getGlobalMontantProgress() {
    const commerciaux = await this.userRepo.find({
      where: { role: 'commercial', isActive: true },
    });

    const result: any[] = [];

    for (const commercial of commerciaux) {
      const objectifs = await this.objectifRepo.find({
        where: { commercial: { id: commercial.id }, isActive: true },
      });

      const totalVente = await this.commandeRepo
        .createQueryBuilder('commande')
        .where('commande.commercialId = :id', { id: commercial.id })
        .select('SUM(commande.prix_total_ttc)', 'total')
        .getRawOne();

      const total = parseFloat(totalVente?.total || '0');

      for (const obj of objectifs) {
        const atteint = obj.montantCible ? total >= obj.montantCible : false;

        result.push({
          commercial: {
            id: commercial.id,
            nom: commercial.nom,
            prenom: commercial.prenom,
          },
          objectifId: obj.id,
          mission: obj.mission,
          montantCible: obj.montantCible,
          ventes: total,
          prime: obj.prime,
          atteint,
        });
      }
    }

    return result;
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
    }, {} as Record<number, ObjectifCommercial[]>);

    return grouped;
  }

  async getSalesByCategory(userId: number) {
    return this.commandeRepo
      .createQueryBuilder('commande')
      .leftJoin('commande.lignesCommande', 'ligne')
      .leftJoin('ligne.produit', 'produit')
      .leftJoin('produit.categorie', 'categorie')
      .select('categorie.nom', 'categorie')
      .addSelect('SUM(ligne.quantite)', 'totalQuantite')
      .where('commande.commercialId = :userId', { userId })
      .groupBy('categorie.nom')
      .getRawMany();
  }

  async getProgressForAdmin(): Promise<
  {
    id: number;
    commercial: User;
    categorie: string | null;
    objectif: number | null;
    realise: number;
    atteint: boolean;
  }[]
> {
  const objectifs = await this.objectifRepo.find({
    relations: ['commercial'],
  });

  const results: {
    id: number;
    commercial: User;
    categorie: string | null;
    objectif: number | null;
    realise: number;
    atteint: boolean;
  }[] = []; // ✅ Type explicite ici

  for (const obj of objectifs) {
    if (!obj.commercial) continue;

    const ventes = await this.commandeRepo
      .createQueryBuilder('commande')
      .leftJoin('commande.lignesCommande', 'ligne')
      .leftJoin('ligne.produit', 'produit')
      .leftJoin('produit.categorie', 'categorie')
      .select('SUM(ligne.quantite)', 'total')
      .where('commande.commercialId = :id', { id: obj.commercial.id })
      .andWhere('categorie.nom = :cat', { cat: obj.categorieProduit })
      .getRawOne();

    const totalCat = parseFloat(ventes?.total || '0');

    const allVentes = await this.commandeRepo
      .createQueryBuilder('commande')
      .leftJoin('commande.lignesCommande', 'ligne')
      .where('commande.commercialId = :id', { id: obj.commercial.id })
      .select('SUM(ligne.quantite)', 'total')
      .getRawOne();

    const totalVentes = parseFloat(allVentes?.total || '0');
    const pourcentage = totalVentes === 0 ? 0 : (totalCat / totalVentes) * 100;

    results.push({
      id: obj.id,
      commercial: obj.commercial,
      categorie: obj.categorieProduit ?? null,
      objectif: obj.pourcentageCible ?? null,
      realise: Number(pourcentage.toFixed(1)),
      atteint: obj.pourcentageCible ? pourcentage >= obj.pourcentageCible : false,
    });
  }

  return results;
}




  async getObjectifsProgress(userId: number) {
    const objectifs = await this.objectifRepo.find({
      where: { commercial: { id: userId }, isActive: true },
    });

    const totalMontant = await this.commandeRepo
      .createQueryBuilder('commande')
      .where('commande.commercialId = :userId', { userId })
      .select('SUM(commande.prix_total_ttc)', 'total')
      .getRawOne();

    const totalVentes = parseFloat(totalMontant?.total || '0');

    return objectifs.map((obj) => ({
      id: obj.id,
      mission: obj.mission,
      dateDebut: obj.dateDebut,
      dateFin: obj.dateFin,
      prime: obj.prime,
      ventes: totalVentes,
      montantCible: obj.montantCible,
      atteint: obj.montantCible ? totalVentes >= obj.montantCible : false,
    }));
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
