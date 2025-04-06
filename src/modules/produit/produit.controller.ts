import { Controller, Post, Body,Get, UploadedFiles, UseInterceptors, UseGuards, Patch, Param } from '@nestjs/common';
import { ProduitService } from './produit.service';
import { CreateProduitDto } from './dto/create-produit.dto';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { SetRoles } from '../auth/setRoles.decorator';
import { UniteService } from '../unite/unite.service';

@ApiTags('Produits')
@Controller('produits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard) 
export class ProduitController {
  constructor(private readonly produitService: ProduitService,
  private readonly uniteService: UniteService, ) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  @SetRoles('admin')
  @UseInterceptors(FilesInterceptor('images', 5, { // 🔥 Accepte jusqu'à 5 images
    storage: diskStorage({
      destination: './uploads', // 📂 Enregistre les images ici
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      }
    }),
  }))
  @ApiOperation({ summary: 'Ajouter un produit avec une unité' })
  @ApiOperation({ summary: 'Ajouter un produit avec plusieurs images' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nom: { type: 'string' },
        description: { type: 'string' },
        prix: { type: 'number' },
        stock: { type: 'number' },
        categorieId: { type: 'string' },
        uniteId: { type: 'number' }, // ✅ Ajout de l'unité
        images: { type: 'array', items: { type: 'string', format: 'binary' } } // 📂 Champ images pour Swagger
      }
    }
  })
  async createProduit(
    @Body() dto: CreateProduitDto,
    @UploadedFiles() files: any // 📂 Récupère plusieurs fichiers
  ) {
    const imagePaths = files.map(file => `/uploads/${file.filename}`); // 🔥 Stocker tous les chemins des images
    return this.produitService.createProduit(dto, imagePaths);
  }
  // ✅ 📌 Voir la liste des produits (ADMIN & COMMERCIAL)
  @Get()
  @UseGuards(JwtAuthGuard)
  @SetRoles('admin', 'commercial') // 🔥 Admin et Commercial peuvent voir les produits
  @ApiOperation({ summary: 'Voir la liste des produits' })
  async getProduits() {
    return this.produitService.getAllProduits();;
  }
  @Get('unites')
  @ApiOperation({ summary: 'Liste des unités disponibles' })
  findAllUnites() {
    return this.uniteService.findAll();
  }
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @SetRoles('admin') // Seul l’admin peut changer le statut
  @ApiOperation({ summary: "Activer/Désactiver un produit" })
  async updateStatutProduit(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean
  ) {
    return this.produitService.updateStatut(Number(id), isActive);
  }
  
}
