import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commande } from './commande.entity';
import { LigneCommande } from '../lignecommande/lignecommande.entity';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { User } from '../users/users.entity';
import { Produit } from '../produit/produit.entity';
import { UpdateCommandeDto } from './dto/update-commande.dto';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express';
import { Readable } from 'stream';
@Injectable()
export class CommandeService {
  constructor(
    @InjectRepository(Commande)
    private commandeRepository: Repository<Commande>,

    @InjectRepository(LigneCommande)
    private ligneCommandeRepository: Repository<LigneCommande>,

    @InjectRepository(Produit)
    private produitRepository: Repository<Produit>,
  ) {}
async generatePdf(id: number): Promise<Buffer> {
  const commande = await this.commandeRepository.findOne({
    where: { id },
    relations: ['client', 'lignes'], // Ajoute relations nécessaires
  });

  if (!commande) throw new NotFoundException('Commande introuvable');

  const doc = new PDFDocument();
  const buffers: any[] = [];

  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  // Contenu du PDF
  doc.fontSize(18).text(`Commande N° ${commande.numero_commande}`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Client : ${commande.client.nom}`);
  doc.text(`Date : ${commande.dateCreation}`);
  doc.moveDown();
  doc.fontSize(16).text('Lignes de commande :');
  commande.lignesCommande.forEach((ligne, i) => {
    doc.text(`- ${ligne.produit.nom} x ${ligne.quantite} = ${ligne.prixUnitaire} TND`);
  });
  doc.moveDown();
  doc.fontSize(14).text(`Total TTC : ${commande.prix_total_ttc} TND`);

  doc.end();

  return new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);
  });
}
  async createCommande(dto: CreateCommandeDto, commercial: User): Promise<Commande> {
    if (commercial.role !== 'commercial') {
      throw new ForbiddenException('Seuls les commerciaux peuvent créer des commandes.');
    }
    console.log('DTO reçu:', dto);


    let prixHorsTaxeTotal = 0;

    // 🛒 Créer la commande vide
   const commande = this.commandeRepository.create({
  numero_commande: dto.numeroCommande,
  prix_total_ttc: 0,
  prix_hors_taxe: 0,
  commercial,
  client: { id: dto.clientId }, // ✅ AJOUTER LE CLIENT
});

    const savedCommande = await this.commandeRepository.save(commande);

    // 🛒 Traiter chaque ligne
    for (const ligne of dto.lignesCommande) {
      const produit = await this.produitRepository.findOneBy({ id: ligne.produitId });
      if (!produit) {
        throw new BadRequestException(`Produit avec ID ${ligne.produitId} introuvable.`);
      }

      const prixUnitaire = produit.prix; // 📦 Prix dans table produit
      const quantite = ligne.quantite;
      const totalLigne = prixUnitaire * quantite; // 💰 Total pour cette ligne

      prixHorsTaxeTotal += totalLigne;

      // ✅ Créer et enregistrer chaque ligne de commande avec total
      const ligneCommande = this.ligneCommandeRepository.create({
        quantite,
        prixUnitaire,
        total: totalLigne, // 👈 AJOUT TOTAL ICI
        produit,
        commande: savedCommande,
      });

      await this.ligneCommandeRepository.save(ligneCommande);
    }

    // 🧮 Calculer la TVA et total TTC
    const tvaRate = 0.055; // 5.5%
    const prixTotalTTC = prixHorsTaxeTotal * (1 + tvaRate);

    savedCommande.prix_hors_taxe = Number(prixHorsTaxeTotal);
    savedCommande.prix_total_ttc = Number(prixTotalTTC);

    await this.commandeRepository.save(savedCommande);

    return savedCommande;
  }
async findAllByCommercial(userId: number, filters?: any): Promise<Commande[]> {
  return this.commandeRepository.find({
    where: { commercial: { id: userId } },
    
    relations: ['client', 'lignesCommande'],
    order: { dateCreation: 'DESC' },
  });
}

 async getAllCommandes(): Promise<Commande[]> {
  return this.commandeRepository.find({
    relations: [
      'client', // ✅ important pour Flutter
      'lignesCommande',
      'lignesCommande.produit',
      'commercial',
    ],
    order: { id: 'DESC' },
  });
}


 async getBandeDeCommande(id: number) {
  const commande = await this.commandeRepository.findOne({
    where: { id },
    relations: ['lignesCommande', 'lignesCommande.produit', 'commercial'],
  });

  if (!commande) {
    throw new NotFoundException(`Commande avec ID ${id} introuvable`);
  }

  return {
    numeroCommande: commande.numero_commande,
    date: commande.dateCreation,
    commercial: {
      nom: commande.commercial?.nom,
      prenom: commande.commercial?.prenom,
      email: commande.commercial?.email,
    },
    produits: commande.lignesCommande.map((ligne) => ({
      id: ligne.id, // ✅ ID ajouté ici
      nomProduit: ligne.produit?.nom,
      quantite: ligne.quantite,
      prixUnitaire: ligne.prixUnitaire,
      total: ligne.total,
    })),
   prixTotalTTC: Number(commande.prix_total_ttc),
prixHorsTaxe: Number(commande.prix_hors_taxe),
  };
}

  async updateCommande(id: number, updateDto: UpdateCommandeDto) {
    const commande = await this.commandeRepository.findOne({
      where: { id },
      relations: ['lignesCommande', 'lignesCommande.produit'],
    });
  
    if (!commande) {
      throw new NotFoundException(`Commande introuvable`);
    }
  
    if (updateDto.lignesCommande && updateDto.lignesCommande.length > 0) {
      for (const ligneUpdate of updateDto.lignesCommande) {
        const ligne = await this.ligneCommandeRepository.findOne({
          where: { id: ligneUpdate.id }
        });
  
        if (ligne && ligneUpdate.quantite !== undefined) {
          ligne.quantite = ligneUpdate.quantite;
          ligne.total = ligne.prixUnitaire * ligne.quantite; // ✅ recalculer le total
          await this.ligneCommandeRepository.save(ligne);
        }
      }
    }
  
    // ♻️ Recharger les lignes de commande mises à jour !
    const lignesMajorees = await this.ligneCommandeRepository.find({
      where: { commande: { id } }
    });
  
    // ♻️ Recalculer prix final
    let prixHorsTaxeTotal = lignesMajorees.reduce(
      (sum, ligne) => sum + (ligne.total || 0),
      0
    );
    const tvaRate = 0.055;
    const prixTotalTTC = prixHorsTaxeTotal * (1 + tvaRate);
  
    commande.prix_hors_taxe = prixHorsTaxeTotal;
    commande.prix_total_ttc = prixTotalTTC;
  
    await this.commandeRepository.save(commande);
  
    return commande;
  }
  
  
  async getCommandesValidees(): Promise<Commande[]> {
    return this.commandeRepository.find({
      where: { statut: 'validee' },
      relations: ['lignesCommande', 'lignesCommande.produit', 'commercial'],
      order: { id: 'DESC' },
    });
  }
  
  async validerCommande(id: number) {
  const commande = await this.commandeRepository.findOne({ where: { id } });
  if (!commande) {
    throw new NotFoundException('Commande introuvable');
  }
  commande.statut = 'validee';
  return this.commandeRepository.save(commande);
}
  

  async deleteCommande(id: number) {
    const commande = await this.commandeRepository.findOneBy({ id });
    if (!commande) {
      throw new NotFoundException('Commande introuvable');
    }
    return this.commandeRepository.remove(commande);
  }
// commande.service.ts

async recalculerTotauxCommande(commandeId: number): Promise<void> {
  // Correction: Utiliser 'lignesCommande' au lieu de 'lignes'
  const commande = await this.commandeRepository.findOne({
    where: { id: commandeId },
    relations: ['lignesCommande'], // <-- Correction ici
  });

  if (!commande) {
    throw new NotFoundException(`Commande ${commandeId} non trouvée`);
  }

  let totalHT = 0;

  // Correction: Utiliser commande.lignesCommande au lieu de commande.lignes
  for (const ligne of commande.lignesCommande) {
    const total = Number(ligne.total);
    if (isNaN(total)) {
      throw new BadRequestException(`Total invalide pour la ligne ${ligne.id}`);
    }
    totalHT += total;
  }

  const prixTotalTTC = parseFloat((totalHT * 1.19).toFixed(2));
  
  commande.prix_hors_taxe = parseFloat(totalHT.toFixed(2));
  commande.prix_total_ttc = prixTotalTTC;

  await this.commandeRepository.save(commande);
}


}
