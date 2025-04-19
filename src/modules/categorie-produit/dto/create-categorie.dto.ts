// ✅ create-categorie.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategorieDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Boissons' })
  nom: string;
}