import { ApiProperty } from '@nestjs/swagger';

export class CreateUniteDto {
  @ApiProperty({ example: 'Kilogramme', description: 'Nom de l\'unité de mesure' })
  nom: string;
}
