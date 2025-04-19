// create-objectif.dto.ts

export class CreateObjectifDto {
    commercialId: number;
    dateDebut: Date;
    dateFin: Date;
    montantCible: number;
    categorieProduit?: string;
    prime: number;
    mission?: string;
    bonus?: number;
  }
  