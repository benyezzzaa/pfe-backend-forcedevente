import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { CategorieClientService } from './categorie-client.service';
import { CreateCategorieClientDto } from './DTO/create-categorie-client.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { SetRoles } from '../auth/setRoles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('categorie-client')
@Controller('categorie-client')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategorieClientController {
  constructor(private readonly categorieService: CategorieClientService) {}

  @Post()
  @SetRoles('commercial')
  @ApiOperation({ summary: 'Ajouter une catégorie (commercial uniquement)' })
  createCategorie(@Body() dto: CreateCategorieClientDto, @Request() req) {
    return this.categorieService.create(dto);
  }

  @Get()
  @SetRoles('admin', 'commercial')
  @ApiOperation({ summary: 'Lister toutes les catégories (admin et commercial)' })
  getAll() {
    return this.categorieService.findAll();
  }
}
 