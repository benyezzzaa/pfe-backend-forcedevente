import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsDateString, IsString } from 'class-validator';

export class CreateReglementDto {
  @ApiProperty({ example: 1, description: 'ID de la facture associée' })
  @IsNumber()
  @IsNotEmpty()
  factureId: number;

  @ApiProperty({ example: 250.50, description: 'Montant payé' })
  @IsNumber()
  @IsNotEmpty()
  montantPaye: number;

  @ApiProperty({ example: '2025-03-18', description: 'Date du paiement' })
  @IsDateString()
  @IsNotEmpty()
  datePaiement: string;

  @ApiProperty({ example: 'Payé', description: 'Statut du règlement' })
  @IsString()
  @IsNotEmpty()
  statut: string;

  @ApiProperty({ example: 1, description: 'ID du type de règlement (optionnel)' })
  @IsNumber()
  @IsOptional()
  typeReglementId?: number;
}
