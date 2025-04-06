import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LigneCommande } from './lignecommande.entity';

@Injectable()
export class LigneCommandeService {
  constructor(
    @InjectRepository(LigneCommande)
    private ligneCommandeRepository: Repository<LigneCommande>,
  ) {}

  async getAllLignesCommande(): Promise<LigneCommande[]> {
    return this.ligneCommandeRepository.find({ relations: ['commande', 'produit'] });
  }
}
