import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategorieProduitService } from './categorie-produit.service';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { SetRoles } from '../auth/setRoles.decorator';

@ApiTags('Catégories de Produits')
@Controller('categories')
@ApiBearerAuth() 
@UseGuards(JwtAuthGuard, RolesGuard)  // 🔒 Protection avec JWT et rôles
export class CategorieProduitController {
  constructor(private readonly categorieService: CategorieProduitService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @SetRoles('admin') // 🔒 Seuls les admins peuvent ajouter une catégorie
  @ApiOperation({ summary: 'Ajouter une catégorie de produit' })
  async createCategorie(@Body() dto: CreateCategorieDto) {
    
    return this.categorieService.createCategorie(dto);
  }

  @Get()
  @SetRoles('admin', 'commercial') // 🔒 Admin & Commercial peuvent voir les catégories
  @ApiOperation({ summary: 'Voir la liste des catégories de produits' })
  async getAllCategories() {
    return this.categorieService.getAllCategories();
  }

  @Get(':id')
  @SetRoles('admin', 'commercial') // 🔒 Admin & Commercial peuvent voir une catégorie
  @ApiOperation({ summary: 'Obtenir une catégorie par ID' })
  async getCategorieById(@Param('id') id: number) {
    return this.categorieService.getCategorieById(id);
  }

  @Put(':id')
  @SetRoles('admin') // 🔒 Seuls les admins peuvent modifier une catégorie
  @ApiOperation({ summary: 'Mettre à jour une catégorie' })
  async updateCategorie(@Param('id') id: number, @Body() dto: CreateCategorieDto) {
    return this.categorieService.updateCategorie(id, dto);
  }

  @Delete(':id')
  @SetRoles('admin') // 🔒 Seuls les admins peuvent supprimer une catégorie
  @ApiOperation({ summary: 'Supprimer une catégorie' })
  async deleteCategorie(@Param('id') id: number) {
    return this.categorieService.deleteCategorie(id);
  }
}
