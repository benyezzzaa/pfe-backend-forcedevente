// ✅ categorie-produit.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseGuards, Put } from '@nestjs/common';
import { CategorieProduitService } from './categorie-produit.service';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { SetRoles } from '../auth/setRoles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Catégories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategorieProduitController {
  constructor(private readonly service: CategorieProduitService) {}

  @Post()
  @SetRoles('admin')
  create(@Body() dto: CreateCategorieDto) {
    return this.service.create(dto);
  }

  @Get()
  @SetRoles('admin', 'commercial')
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  @SetRoles('admin', 'commercial')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @Put(':id')
  @SetRoles('admin')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateCategorieDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @SetRoles('admin')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}