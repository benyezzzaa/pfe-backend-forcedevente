import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReglementFacture } from './reglement-facture.entity';
import { ReglementFactureService } from './reglement-facture.service';
import { ReglementFactureController } from './reglement-facture.controller';
import { Reglement } from '../reglement/reglement.entity';
import { Facture } from '../facture/facture.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReglementFacture,  // ✅ Tu injectes le Repository de ReglementFacture
      Reglement,          // ✅ Tu injectes aussi le Repository de Reglement
      Facture,            // ✅ Tu injectes aussi le Repository de Facture
    ])
  ],
  providers: [ReglementFactureService],
  controllers: [ReglementFactureController],
  exports: [ReglementFactureService], // 🔥 Important si tu veux utiliser ailleurs
})
export class ReglementFactureModule {}
