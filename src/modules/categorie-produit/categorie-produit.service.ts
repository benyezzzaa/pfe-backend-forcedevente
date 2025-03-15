import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategorieProduit } from './categorie-produit.entity';
import { CreateCategorieDto } from './dto/create-categorie.dto';

@Injectable()
export class CategorieProduitService {
  constructor(
    @InjectRepository(CategorieProduit)
    private categorieProduitRepository: Repository<CategorieProduit>,
  ) {}

  async createCategorie(dto: CreateCategorieDto): Promise<CategorieProduit> {
    const nouvelleCategorie = this.categorieProduitRepository.create(dto);
    return this.categorieProduitRepository.save(nouvelleCategorie);
  }

  async getAllCategories(): Promise<CategorieProduit[]> {
    return this.categorieProduitRepository.find({ relations: ['produits'] });
  }

  async getCategorieById(id: number): Promise<CategorieProduit> {
    const categorie = await this.categorieProduitRepository.findOne({ where: { id }, relations: ['produits'] });
    if (!categorie) {
      throw new NotFoundException('Catégorie non trouvée');
    }
    return categorie;
  }

  async updateCategorie(id: number, dto: CreateCategorieDto): Promise<CategorieProduit> {
    const categorie = await this.getCategorieById(id);
    Object.assign(categorie, dto);
    return this.categorieProduitRepository.save(categorie);
  }

  async deleteCategorie(id: number): Promise<void> {
    const result = await this.categorieProduitRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Catégorie non trouvée');
    }
  }
}
