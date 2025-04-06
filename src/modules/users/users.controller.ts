import { Controller, Get, Post, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { SetRoles } from '../auth/setRoles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  // ✅ Créer un commercial
  @Post('create-commercial')
  @SetRoles('admin')
  @ApiOperation({ summary: 'Créer un commercial' })
  createCommercial(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createCommercial(createUserDto);
  }

  // ✅ Lister tous les commerciaux
  @Get('commerciaux')
  @SetRoles('admin')
  @ApiOperation({ summary: 'Lister les commerciaux' })
  findAllCommerciaux() {
    return this.usersService.findAllCommerciaux();
  }

  // ✅ Supprimer un utilisateur (commercial ou autre)
  @Delete(':id')
  @SetRoles('admin')
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  deleteUser(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }

  // ✅ Voir tous les utilisateurs (optionnel si nécessaire)
  @Get()
  @SetRoles('admin')
  findAll() {
    return this.usersService.findAll();
  }
}
