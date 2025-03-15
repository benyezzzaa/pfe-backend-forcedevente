import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './DTO/create-client.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { SetRoles } from '../auth/setRoles.decorator';

@ApiTags('client')
@ApiBearerAuth() // ✅ Active l'authentification si besoin
@Controller('client')
@UseGuards(JwtAuthGuard, RolesGuard) // 🔒 Protection avec JWT et rôles
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @SetRoles('commercial')
  @ApiOperation({ summary: 'Ajouter un client (Commercial uniquement)' })
async createClient(@Body() dto: CreateClientDto, @Request() req) {
  return this.clientService.createClient(dto, req.user);
}

  @Get()
  @ApiOperation({ summary: 'Voir tous les clients' })
  async getAllClients() {
    return this.clientService.getAllClients();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Voir un client spécifique' })
  async getClientById(@Param('id') id: number) {
    return this.clientService.getClientById(id);
  }

  @Put(':id')
  @SetRoles('commercial')
  @ApiOperation({ summary: 'Modifier un client (Commercial propriétaire uniquement)' })
  async updateClient(@Param('id') id: number, @Body() dto: CreateClientDto, @Request() req) {
    return this.clientService.updateClient(id, dto, req.user);
  }

  @Delete(':id')
  @SetRoles('commercial')
  @ApiOperation({ summary: 'Supprimer un client (Commercial propriétaire uniquement)' })
  async deleteClient(@Param('id') id: number, @Request() req) {
    return this.clientService.deleteClient(id, req.user);
  }
}
