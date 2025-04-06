import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reglement } from './reglement.entity';
import { Facture } from '../facture/facture.entity';
import { TypeReglement } from '../type-reglement/typeReglement.entity';
import { CreateReglementDto } from './dto/create-reglement.dto';

@Injectable()
export class ReglementService {
  constructor(
    @InjectRepository(Reglement)
    private readonly reglementRepository: Repository<Reglement>,

    @InjectRepository(Facture)
    private readonly factureRepository: Repository<Facture>,

    @InjectRepository(TypeReglement)
    private readonly typeReglementRepository: Repository<TypeReglement>,
  ) {}

  // ✅ Créer un règlement
  async createReglement(dto: CreateReglementDto): Promise<Reglement> {
    const facture = await this.factureRepository.findOne({ where: { id: dto.factureId } });
    if (!facture) throw new NotFoundException(`Facture avec ID ${dto.factureId} introuvable.`);

    // ✅ Correction TypeReglement (null → undefined)
    let typeReglement: TypeReglement | undefined;
    if (dto.typeReglementId) {
      typeReglement = await this.typeReglementRepository.findOne({ where: { id: dto.typeReglementId } }) || undefined;
    }

    const newReglement = this.reglementRepository.create({
      montantPaye: dto.montantPaye,
      datePaiement: new Date(dto.datePaiement), // ✅ Convertir `string` en `Date`
      statut: dto.statut || 'En attente',
      facture,
      typeReglement, // ✅ `null` devient `undefined`
    });

    return await this.reglementRepository.save(newReglement);
  }

  // ✅ Récupérer tous les règlements
  async getReglements(): Promise<Reglement[]> {
    return await this.reglementRepository.find({ relations: ['facture', 'typeReglement'] });
  }

  // ✅ Récupérer un règlement par ID
  async getReglementById(id: number): Promise<Reglement> {
    const reglement = await this.reglementRepository.findOne({ where: { id }, relations: ['facture', 'typeReglement'] });
    if (!reglement) throw new NotFoundException(`Règlement avec ID ${id} introuvable.`);
    return reglement;
  }

  // ✅ Mettre à jour un règlement
  async updateReglement(id: number, dto: CreateReglementDto): Promise<Reglement> {
    const reglement = await this.getReglementById(id);

    if (dto.factureId) {
      const facture = await this.factureRepository.findOne({ where: { id: dto.factureId } });
      if (!facture) throw new NotFoundException(`Facture avec ID ${dto.factureId} introuvable.`);
      reglement.facture = facture;
    }

    if (dto.typeReglementId) {
      reglement.typeReglement = await this.typeReglementRepository.findOne({ where: { id: dto.typeReglementId } }) || undefined;
    }

    reglement.montantPaye = dto.montantPaye ?? reglement.montantPaye;
    reglement.datePaiement = dto.datePaiement ? new Date(dto.datePaiement) : reglement.datePaiement; // ✅ Correction de `string` en `Date`
    reglement.statut = dto.statut ?? reglement.statut;

    return await this.reglementRepository.save(reglement);
  }

  // ✅ Supprimer un règlement
  async deleteReglement(id: number): Promise<void> {
    const reglement = await this.getReglementById(id);
    await this.reglementRepository.remove(reglement);
  }
}
