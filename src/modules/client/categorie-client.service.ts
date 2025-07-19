import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategorieClient } from './categorie-client.entity';
import { CreateCategorieClientDto } from './DTO/create-categorie-client.dto';

@Injectable()
export class CategorieClientService {
  constructor(
    @InjectRepository(CategorieClient)
    private readonly categorieRepo: Repository<CategorieClient>,
  ) {}

  async create(dto: CreateCategorieClientDto): Promise<CategorieClient> {
    const exists = await this.categorieRepo.findOneBy({ nom: dto.nom });
    if (exists) {
      throw new ConflictException('Cette catégorie existe déjà');
    }

    const newCategorie = this.categorieRepo.create(dto);
    return this.categorieRepo.save(newCategorie);
  }

  async findAll(): Promise<CategorieClient[]> {
    return this.categorieRepo.find();
  }
}
