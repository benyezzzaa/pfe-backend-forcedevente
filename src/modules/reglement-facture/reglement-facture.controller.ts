import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReglementFactureService } from './reglement-facture.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { SetRoles } from '../auth/setRoles.decorator';

@ApiTags('Reglement-Facture')
@ApiBearerAuth()
@Controller('reglement-facture')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReglementFactureController {
  constructor(private readonly reglementFactureService: ReglementFactureService) {}

  @Get()
  @SetRoles('admin')
  findAll() {
    return this.reglementFactureService.findAll();
  }
}
