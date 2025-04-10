import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commande } from '../commande/commande.entity';
import { Produit } from '../produit/produit.entity';
import { User } from '../users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Commande)
    private commandeRepository: Repository<Commande>,

    @InjectRepository(Produit)
    private produitRepository: Repository<Produit>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getStats() {
    const totalCommandes = await this.commandeRepository.count();
    const totalProduits = await this.produitRepository.count();
    const totalUtilisateurs = await this.userRepository.count();
    return { totalCommandes, totalProduits, totalUtilisateurs };
  }

  async getVentesParCommercial() {
    const result = await this.commandeRepository
      .createQueryBuilder('commande')
      .leftJoin('commande.commercial', 'commercial')
      .select('commercial.prenom', 'commercial')
      .addSelect('SUM(commande.prix_total_ttc)', 'total')
      .groupBy('commercial.prenom')
      .getRawMany();

    return result.map(r => ({
      commercial: r.commercial,
      total: parseFloat(r.total),
    }));
  }

  async getVentesParCategorie() {
    const result = await this.produitRepository
      .createQueryBuilder('produit')
      .leftJoin('produit.categorie', 'categorie')
      .select('categorie.nom', 'categorie')
      .addSelect('COUNT(produit.id)', 'quantite')
      .groupBy('categorie.nom')
      .getRawMany();

    return result.map(r => ({
      categorie: r.categorie,
      quantite: parseInt(r.quantite, 10),
    }));
  }

  async getVentesParMois() {
    const result = await this.commandeRepository
      .createQueryBuilder('commande')
      .select("TO_CHAR(commande.date_creation, 'Mon')", 'mois')
      .addSelect('SUM(commande.prix_total_ttc)', 'montant')
      .groupBy('mois')
      .orderBy('min(commande.date_creation)', 'ASC')
      .getRawMany();

    return result.map(r => ({
      mois: r.mois,
      montant: parseFloat(r.montant),
    }));
  }
}
