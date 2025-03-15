import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UniteService } from './unite.service';
import { CreateUniteDto } from './dto/CreateUniteDto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Unite')
@ApiBearerAuth() 
@Controller('unite')
export class UniteController {
  constructor(private readonly uniteService: UniteService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une unité' })
  create(@Body() dto: CreateUniteDto) {
    return this.uniteService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtenir toutes les unités' })
  findAll() {
    return this.uniteService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une unité par ID' })
  findOne(@Param('id') id: number) {
    return this.uniteService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une unité' })
  update(@Param('id') id: number, @Body() dto: CreateUniteDto) {
    return this.uniteService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une unité' })
  delete(@Param('id') id: number) {
    return this.uniteService.delete(id);
  }
}
