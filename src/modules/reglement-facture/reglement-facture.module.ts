import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReglementFacture } from './reglement-facture.entity';
import { ReglementFactureService } from './reglement-facture.service';
import { ReglementFactureController } from './reglement-facture.controller';
import { Reglement } from '../reglement/reglement.entity';
import { Facture } from '../facture/facture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReglementFacture, Reglement, Facture])], // ✅ Enregistre les repositories
  controllers: [ReglementFactureController],
  providers: [ReglementFactureService],
  exports: [ReglementFactureService, TypeOrmModule], // ✅ Exporte bien TypeOrmModule
})
export class ReglementFactureModule {}
