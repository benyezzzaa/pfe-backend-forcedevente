import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ example: 'Ali', description: 'Nom du client' })
  nom: string;

  @ApiProperty({ example: 'Ben Salah', description: 'Prénom du client' })
  prenom: string;

  @ApiProperty({ example: 'ali.bensalah@example.com', description: 'Email du client' })
  email: string;

  @ApiProperty({ example: '555123456', description: 'Téléphone du client' })
  telephone: string;

  @ApiProperty({ example: '10 Rue de Tunis', description: 'Adresse du client' })
  adresse: string;

  @ApiProperty({ example: true, description: 'Est-ce un client fidèle ?', default: false })
  estFidele: boolean;
}
