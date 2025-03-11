import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategorieProduit } from './categorie-produit.entity';

@Injectable()
export class CategorieProduitService {
  constructor(
    @InjectRepository(CategorieProduit)
    private categorieRepository: Repository<CategorieProduit>,
  ) {}

  // 🔹 Récupérer toutes les catégories
  async getAllCategories(): Promise<CategorieProduit[]> {
    return await this.categorieRepository.find();
  }
}
