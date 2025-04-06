import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Reglement } from '../reglement/reglement.entity';
import { Facture } from '../facture/facture.entity';
import { ReglementFacture } from '../reglement-facture/reglement-facture.entity';

@Injectable()
export class ReglementFactureService {
  constructor(
    @InjectRepository(ReglementFacture)
    private reglementFactureRepository: Repository<ReglementFacture>,

    @InjectRepository(Reglement)
    private reglementRepository: Repository<Reglement>,

    @InjectRepository(Facture)
    private factureRepository: Repository<Facture>,
  ) {}

  async linkReglementToFacture(reglementId: number, factureId: number): Promise<ReglementFacture> {
    const reglement = await this.reglementRepository.findOne({ where: { id: reglementId } });
    const facture = await this.factureRepository.findOne({ where: { id: factureId } });

    if (!reglement || !facture) throw new NotFoundException('Règlement ou Facture non trouvé.');

    const reglementFacture = this.reglementFactureRepository.create({ reglement, facture });
    return await this.reglementFactureRepository.save(reglementFacture);
  }
}
