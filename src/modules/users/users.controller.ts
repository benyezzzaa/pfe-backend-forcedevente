import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards
} from '@nestjs/common';
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

  // ✅ Obtenir tous les utilisateurs (avec filtre optionnel par rôle)
  @Get()
  @SetRoles('admin')
  @ApiOperation({ summary: 'Lister les utilisateurs avec filtre par rôle' })
  findUsers(@Query('role') role?: string) {
    return this.usersService.findByRole(role);
  }

  // ✅ Activer/Désactiver un utilisateur
  @Patch(':id/status')
  @SetRoles('admin')
  @ApiOperation({ summary: 'Activer ou désactiver un utilisateur' })
  toggleUserStatus(@Param('id') id: number, @Body() body: { isActive: boolean }) {
    return this.usersService.updateStatus(id, body.isActive);
  }
  @Post('create-admin')
@SetRoles('admin')
createAdmin(@Body() createUserDto: CreateUserDto) {
  return this.usersService.createAdmin(createUserDto);
}
}
