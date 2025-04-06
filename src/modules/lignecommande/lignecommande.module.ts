import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LigneCommande } from './lignecommande.entity';
import { LigneCommandeService } from './lignecommande.service';
import { LigneCommandeController } from './lignecommande.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LigneCommande])],
  controllers: [LigneCommandeController],
  providers: [LigneCommandeService],
})
export class LigneCommandeModule {}
