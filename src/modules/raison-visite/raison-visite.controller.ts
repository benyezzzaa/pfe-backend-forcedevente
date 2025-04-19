import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { RaisonVisiteService } from './raison-visite.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { SetRoles } from '../auth/setRoles.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Raisons de Visite')
@ApiBearerAuth()
@Controller('raisons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RaisonVisiteController {
  constructor(private readonly service: RaisonVisiteService) {}

  @Get()
  @SetRoles('admin')
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @SetRoles('admin')
  create(@Body('nom') nom: string) {
    return this.service.create(nom);
  }

  @Patch(':id')
  @SetRoles('admin')
  update(@Param('id') id: number, @Body() body: any) {
    console.log('▶️ PATCH reçu pour id:', id);
    console.log('📦 Body reçu :', body);

    if (!body.nom || typeof body.nom !== 'string') {
      throw new NotFoundException('Le champ "nom" est requis.');
    }

    return this.service.update(id, body.nom);
  }

  @Patch(':id/status')
  @SetRoles('admin')
  toggleActive(@Param('id') id: number) {
    return this.service.toggleActive(id);
  }
}
