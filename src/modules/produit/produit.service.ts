import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produit } from './produit.entity';
import { CreateProduitDto } from './dto/create-produit.dto';
import { CategorieProduit } from '../categorie-produit/categorie-produit.entity';
import { Unite } from '../unite/unite.entity';
@Injectable()
export class ProduitService {
  constructor(
    @InjectRepository(Produit)
    private produitRepository: Repository<Produit>,

    @InjectRepository(CategorieProduit)
    private categorieProduitRepository: Repository<CategorieProduit>,
    @InjectRepository(Unite)
    private uniteRepository: Repository<Unite>,
  ) {}

  async createProduit(dto: CreateProduitDto, imageFilenames?: string[]) {
    let categorie = await this.categorieProduitRepository.findOne({
      where: { nom: dto.categorieId },
    });

    if (!categorie) {
      categorie = this.categorieProduitRepository.create({ nom: dto.categorieId });
      await this.categorieProduitRepository.save(categorie);
    }
 // 🔹 Vérifier si l’unité existe
 const unite = await this.uniteRepository.findOne({ where: { nom: dto.uniteId } });
 if (!unite) {
   throw new NotFoundException(`Unité ID ${dto.uniteId} non trouvée`);
 }
    const produit = this.produitRepository.create({
      ...dto,
      images: imageFilenames ?? [],
      unite, // 🔥 Stocker les images sous forme de tableau
    });

    return this.produitRepository.save(produit);
  }
  
  // ✅ 📌 Récupérer tous les produits avec leurs catégories et unités associées
  async getAllProduits() {
    return this.produitRepository.find({
      relations: ['categorie', 'unite'], // 🔥 Charge les relations avec les catégories et les unités
    });
}
async updateStatut(id: number, isActive: boolean) {
  const produit = await this.produitRepository.findOneBy({ id });

  if (!produit) {
    throw new NotFoundException('Produit introuvable');
  }

  produit.isActive = isActive;

  return this.produitRepository.save(produit);
}
}
