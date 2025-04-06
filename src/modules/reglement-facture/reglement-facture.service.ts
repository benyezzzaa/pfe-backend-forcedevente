import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReglementFacture } from './reglement-facture.entity';
import { Reglement } from '../reglement/reglement.entity';
import { Facture } from '../facture/facture.entity';

@Injectable()
export class ReglementFactureService {
  constructor(
    @InjectRepository(ReglementFacture)
    private readonly reglementFactureRepository: Repository<ReglementFacture>, // ✅ Assure l'injection correcte

    @InjectRepository(Reglement)
    private readonly reglementRepository: Repository<Reglement>,

    @InjectRepository(Facture)
    private readonly factureRepository: Repository<Facture>,
  ) {}

  async listerReglementsFactures(): Promise<ReglementFacture[]> {
    return this.reglementFactureRepository.find({ relations: ['facture', 'reglement'] });
  }
}
