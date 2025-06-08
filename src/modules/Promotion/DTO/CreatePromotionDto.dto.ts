import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreatePromotionDto {
  @ApiProperty({ example: 'Promo Été', description: 'Titre de la promotion' })
  @IsString()
  titre: string;

  @ApiProperty({ example: 'Jusqu’à 20% de réduction sur tous les produits' })
  @IsString()
  description: string;

  @ApiProperty({ example: 20 })
  @IsNumber()
  tauxReduction: number;

  @ApiProperty({ example: '2024-06-01', format: 'date' })
  @IsDateString()
  dateDebut: Date;

  @ApiProperty({ example: '2024-06-30', format: 'date' })
  @IsDateString()
  dateFin: Date;
}
