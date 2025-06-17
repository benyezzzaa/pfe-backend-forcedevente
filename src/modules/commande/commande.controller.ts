import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
  Delete,
  Param,
  Patch,
  Req,
  Put,
  Res,
} from '@nestjs/common';
import { CommandeService } from './commande.service';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { SetRoles } from '../auth/setRoles.decorator';
import { UpdateCommandeDto } from './dto/update-commande.dto';
import { Not } from 'typeorm';
import { Response } from 'express';
@ApiTags('Commandes')
@ApiBearerAuth()
@Controller('commandes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommandeController {
  constructor(private readonly commandeService: CommandeService) {}

  @Post()
  async createCommande(@Body() dto: CreateCommandeDto, @Request() req) {
    return this.commandeService.createCommande(dto, req.user);
  }

  @Get()
  @SetRoles('admin', 'commercial')
  @ApiOperation({ summary: 'Voir toutes les commandes' })
  async getAllCommandes() {
    return this.commandeService.getAllCommandes();
  }

  @Get('validees')
  @SetRoles('admin', 'commercial')
  @ApiOperation({ summary: 'Voir uniquement les commandes validées' })
  async getCommandesValidees() {
    return this.commandeService.getCommandesValidees();
  }

  @Get('bande/:id')
  @SetRoles('admin', 'commercial')
  @ApiOperation({ summary: 'Voir une bande de commande spécifique' })
  async getBandeDeCommande(@Param('id') id: number) {
    return this.commandeService.getBandeDeCommande(id);
  }

  @Patch(':id')
  @SetRoles('admin')
  @ApiOperation({ summary: 'Modifier une commande (admin)' })
  async updateCommande(
    @Param('id') id: number,
    @Body() updateDto: UpdateCommandeDto,
  ) {
    return this.commandeService.updateCommande(id, updateDto);
  }

 @Put('valider/:id')
@SetRoles('admin') // ❗ Bloque les commerciaux
@ApiOperation({ summary: 'Valider une commande (admin)' })
validerCommande(@Param('id') id: number) {
  return this.commandeService.validerCommande(+id);
}
@Get('me')
@UseGuards(JwtAuthGuard, RolesGuard)
@SetRoles('commercial')
async getMyCommandes(@Req() req) {
  const userId = req.user.id;
  return this.commandeService.findAllByCommercial(userId, { statut: Not('validée') });
}
@Get('validees')
@UseGuards(JwtAuthGuard)
findCommandesValidees() {
  return this.commandeService.getCommandesValidees();
}

  @Patch('message/:id')
  @SetRoles('admin')
  async envoyerMessage(@Param('id') id: number, @Body() body: { message: string }) {
    // Stockage ou envoi du message (pas encore implémenté)
  }
// commandes.controller.ts
@Get('pdf/:id')
@UseGuards(JwtAuthGuard)
@Get(':id/pdf')
async downloadPdf(@Param('id') id: number, @Res() res: Response) {
  const pdfBuffer = await this.commandeService.generatePdf(+id);
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="commande_${id}.pdf"`,
  });
  res.send(pdfBuffer);
}
  @Delete(':id')
  @SetRoles('admin')
  @ApiOperation({ summary: 'Supprimer une commande' })
  async deleteCommande(@Param('id') id: number) {
    return this.commandeService.deleteCommande(id);
  }
}
