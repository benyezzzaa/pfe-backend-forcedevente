import { Controller, Get } from '@nestjs/common';
import { CategorieProduitService } from './categorie-produit.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategorieProduitController {
  constructor(private readonly categorieService: CategorieProduitService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les catégories' })
  async getAllCategories() {
    return this.categorieService.getAllCategories();
  }
}
