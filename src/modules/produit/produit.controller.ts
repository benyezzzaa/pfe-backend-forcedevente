import { Controller, Post, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProduitService } from './produit.service';
import { CreateProduitDto } from './dto/create-produit.dto';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Produits')
@Controller('produits')
export class ProduitController {
  constructor(private readonly produitService: ProduitService) {}

  @Post()
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
}
