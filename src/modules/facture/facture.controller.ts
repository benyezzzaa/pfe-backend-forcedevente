import { Controller, Post, Body } from '@nestjs/common';
 // ✅ Correction de l'import
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReglementFactureService } from './facture.service';

@ApiTags('Règlement-Factures') // ✅ Ajout pour Swagger
@ApiBearerAuth() // ✅ Ajout de l'authentification si nécessaire
@Controller('reglementfactures')
export class ReglementFactureController {
  constructor(private readonly reglementFactureService: ReglementFactureService) {}

  @Post()
  @ApiOperation({ summary: 'Associer un règlement à une facture' }) // ✅ Swagger
  async linkReglementToFacture(
    @Body() dto: { reglementId: number; factureId: number }
  ) {
    return this.reglementFactureService.linkReglementToFacture(dto.reglementId, dto.factureId);
  }
}
