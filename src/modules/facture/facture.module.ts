import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facture } from './facture.entity';


import { Commande } from '../commande/commande.entity';
import { ReglementFactureController } from './facture.controller';
import { ReglementFactureService } from './facture.service';
import { ReglementFactureModule } from '../reglement-facture/reglement-facture.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Facture, Commande]),// ✅ Ajoute bien Facture ici
    ReglementFactureModule, // 📌 Ajout pour utiliser `ReglementFactureService`
  ],
  controllers: [ReglementFactureController],
  providers: [ReglementFactureService],
  exports: [ReglementFactureService], // ✅ Permet d'utiliser FactureService ailleurs
})
export class FactureModule {}