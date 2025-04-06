import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReglementFacture } from './reglement-facture.entity';

@Injectable()
export class ReglementFactureService {
  constructor(
    @InjectRepository(ReglementFacture)
    private readonly reglementFactureRepository: Repository<ReglementFacture>,
  ) {}

  // 🔥 Récupérer toutes les bandes de commande
  async findAll(): Promise<ReglementFacture[]> {
    return this.reglementFactureRepository.find({
      relations: ['reglement', 'facture'],
    });
  }
}
