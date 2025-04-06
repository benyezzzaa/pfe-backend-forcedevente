import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ReglementService } from './reglement.service';
import { CreateReglementDto } from './dto/create-reglement.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { SetRoles } from '../auth/setRoles.decorator';

@ApiTags('Règlements')
@ApiBearerAuth()
@Controller('reglements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReglementController {
  constructor(private readonly reglementService: ReglementService) {}

  @Post()
  @SetRoles('admin', 'commercial')
  @ApiOperation({ summary: 'Créer un règlement' })
  async createReglement(@Body() dto: CreateReglementDto) {
    return this.reglementService.createReglement(dto);
  }

  @Get()
  @SetRoles('admin', 'commercial')
  @ApiOperation({ summary: 'Lister tous les règlements' })
  async getReglements() {
    return this.reglementService.getReglements();
  }

  @Get(':id')
  @SetRoles('admin', 'commercial')
  @ApiOperation({ summary: 'Récupérer un règlement par ID' })
  async getReglementById(@Param('id') id: number) {
    return this.reglementService.getReglementById(id);
  }

  @Put(':id')
  @SetRoles('admin')
  @ApiOperation({ summary: 'Mettre à jour un règlement' })
  async updateReglement(@Param('id') id: number, @Body() dto: CreateReglementDto) {
    return this.reglementService.updateReglement(id, dto);
  }

  @Delete(':id')
  @SetRoles('admin')
  @ApiOperation({ summary: 'Supprimer un règlement' })
  async deleteReglement(@Param('id') id: number) {
    return this.reglementService.deleteReglement(id);
  }
}
