import { ApiProperty } from '@nestjs/swagger';

export class CreateVisiteDto {
  @ApiProperty({ example: '2025-03-15', description: 'Date de la visite' })
  date: Date;

  @ApiProperty({ example: 'Discussion sur les nouveaux produits', description: 'Raison de la visite' })
  raison: string;
}
