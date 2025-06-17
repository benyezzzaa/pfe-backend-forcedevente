import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    if (!dto.uniteId || !dto.categorieId) {
      throw new BadRequestException('Les champs uniteId et categorieId sont requis.');
    }

    // 🔎 Trouver l’unité par nom (non sensible à la casse)
    const unite = await this.uniteRepository
      .createQueryBuilder('unite')
      .where('LOWER(unite.nom) = LOWER(:nom)', { nom: dto.uniteId })
      .getOne();

    if (!unite) {
      throw new NotFoundException(`Unité "${dto.uniteId}" non trouvée.`);
    }

    // 🔎 Trouver la catégorie par nom
    const categorie = await this.categorieProduitRepository.findOneBy({ nom: dto.categorieId });
    if (!categorie) {
      throw new NotFoundException(`Catégorie "${dto.categorieId}" non trouvée.`);
    }

    // ✅ Créer le produit
    const produit = this.produitRepository.create({
      nom: dto.nom,
      description: dto.description,
      prix: dto.prix,
      stock: dto.stock,
      prix_unitaire: dto.prix_unitaire,
      images: imageFilenames ?? [],
      uniteId: unite.nom,
      categorieId: categorie.id,
    });

    return this.produitRepository.save(produit);
  }

  async getAllProduits() {
    return this.produitRepository.find({
      relations: ['categorie', 'unite'],
    });
  }
async updateProduit(id: number, dto: CreateProduitDto, imageFilenames?: string[]) {
  const produit = await this.produitRepository.findOneBy({ id });

  if (!produit) {
    throw new NotFoundException('Produit introuvable');
  }

  // Update fields
  produit.nom = dto.nom ?? produit.nom;
  produit.description = dto.description ?? produit.description;
  produit.prix = dto.prix ?? produit.prix;
  produit.stock = dto.stock ?? produit.stock;
  produit.prix_unitaire = dto.prix_unitaire ?? produit.prix_unitaire;

  if (dto.uniteId) {
    const unite = await this.uniteRepository
      .createQueryBuilder('unite')
      .where('LOWER(unite.nom) = LOWER(:nom)', { nom: dto.uniteId })
      .getOne();
    if (!unite) {
      throw new NotFoundException(`Unité "${dto.uniteId}" non trouvée.`);
    }
    produit.uniteId = unite.nom;
  }

  if (dto.categorieId) {
    // Convert categorieId to number
    const categorieIdNum = parseInt(dto.categorieId);
    if (isNaN(categorieIdNum)) {
      throw new BadRequestException(`Catégorie ID "${dto.categorieId}" invalide, un nombre est requis.`);
    }

    const categorie = await this.categorieProduitRepository.findOneBy({ id: categorieIdNum });
    if (!categorie) {
      throw new NotFoundException(`Catégorie "${dto.categorieId}" non trouvée.`);
    }
    produit.categorieId = categorie.id;
  }

  if (imageFilenames && imageFilenames.length > 0) {
    produit.images = imageFilenames;
  }

  return this.produitRepository.save(produit);
}
  async updateStatut(id: number, isActive: boolean) {
    const produit = await this.produitRepository.findOneBy({ id });

    if (!produit) {
      throw new NotFoundException('Produit introuvable');
    }

    await this.produitRepository
      .createQueryBuilder()
      .update(Produit)
      .set({ isActive: isActive })
      .where("id = :id", { id })
      .execute();

    return { message: `Produit ${isActive ? 'activé' : 'désactivé'} ✅` };
  }
}
