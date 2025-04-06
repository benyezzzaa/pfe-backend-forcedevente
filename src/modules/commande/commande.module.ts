import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commande } from './commande.entity';
import { LigneCommande } from '../lignecommande/lignecommande.entity'; 

import { Produit } from '../produit/produit.entity';
import { CommandeService } from './commande.service';
import { CommandeController } from './commande.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Commande, LigneCommande, Produit])],
  controllers: [CommandeController],
  providers: [CommandeService],
  exports: [CommandeService],
})
export class CommandeModule {}
