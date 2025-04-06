import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commande } from './commande.entity';
import { LigneCommande } from '../lignecommande/lignecommande.entity'; // ✅ Corrigé

import { CreateCommandeDto } from './dto/create-commande.dto';
import { User } from '../users/users.entity';
import { Produit } from '../produit/produit.entity';

@Injectable()
export class CommandeService {
  constructor(
    @InjectRepository(Commande)
    private commandeRepository: Repository<Commande>,

    @InjectRepository(LigneCommande)
    private ligneCommandeRepository: Repository<LigneCommande>,

    @InjectRepository(Produit)
    private produitRepository: Repository<Produit>,
  ) {}

  async createCommande(dto: CreateCommandeDto, commercial: User): Promise<Commande> {
    if (commercial.role !== 'commercial') {
      throw new ForbiddenException('Seuls les commerciaux peuvent créer des commandes.');
    }
  
    // 🚨 Debug : Vérifie les valeurs reçues
    console.log('✅ DTO reçu:', dto);
  
    if (!dto.prixTotalTTC || !dto.prixHorsTaxe) {
      throw new BadRequestException('Erreur : Le prix total TTC et le prix hors taxe sont requis.');
    }
  
    const commande = this.commandeRepository.create({
      numero_commande: dto.numeroCommande,
      prix_total_ttc: dto.prixTotalTTC,  // 🛠 Corrigé !
       prix_hors_taxe: dto.prixHorsTaxe, 
      commercial,
    });
  
    console.log('✅ Commande avant sauvegarde:', commande);
  
    const savedCommande = await this.commandeRepository.save(commande);
  
    console.log('✅ Commande sauvegardée en base:', savedCommande);
  
    return savedCommande;
  }
  

  async getAllCommandes(): Promise<Commande[]> {
    return await this.commandeRepository.find({ relations: ['lignesCommande', 'commercial'] });
  }
  async deleteCommande(id: number) {
  const commande = await this.commandeRepository.findOneBy({ id });
  if (!commande) {
    throw new NotFoundException('Commande introuvable');
  }
  return this.commandeRepository.remove(commande);
}
}
