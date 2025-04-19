import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  Request
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './DTO/create-client.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { SetRoles } from '../auth/setRoles.decorator';

@ApiTags('client')
@ApiBearerAuth()
@Controller('client')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @SetRoles('commercial')
  @ApiOperation({ summary: 'Ajouter un client (Commercial uniquement)' })
  async createClient(@Body() dto: CreateClientDto, @Request() req) {
    return this.clientService.createClient(dto, req.user);
  }

  @Get()
  @SetRoles('admin', 'commercial')
  @ApiOperation({ summary: 'Voir tous les clients' })
  async getAllClients() {
    return this.clientService.getAllClients();
  }

  @Get(':id')
  @SetRoles('admin', 'commercial')
  @ApiOperation({ summary: 'Voir un client spécifique' })
  async getClientById(@Param('id') id: number) {
    return this.clientService.getClientById(id);
  }

  @Put(':id')
  @SetRoles('admin', 'commercial')
  @ApiOperation({ summary: 'Modifier un client (Admin ou Commercial propriétaire)' })
  async updateClient(@Param('id') id: number, @Body() dto: CreateClientDto, @Request() req) {
    return this.clientService.updateClient(id, dto, req.user);
  }

  @Delete(':id')
  @SetRoles('admin', 'commercial')
  @ApiOperation({ summary: 'Supprimer un client (Admin ou Commercial propriétaire)' })
  async deleteClient(@Param('id') id: number, @Request() req) {
    return this.clientService.deleteClient(id, req.user);
  }

  @Patch(':id/status')
  @SetRoles('admin', 'commercial') // Avant : seulement 'admin'
  @ApiOperation({ summary: 'Activer/Désactiver un client (Admin ou Commercial propriétaire)' })
  async updateClientStatus(@Param('id') id: number, @Body() body: { isActive: boolean }, @Request() req) {
    return this.clientService.updateClientStatus(id, body.isActive, req.user);
  }
}
