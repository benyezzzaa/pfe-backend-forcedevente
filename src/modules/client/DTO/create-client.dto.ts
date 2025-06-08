import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ example: 'Ali' })
  @IsOptional()
  @IsString()
  nom?: string;
 @ApiProperty({ example: 36.8065, required: false })
@IsOptional()
@IsNumber()
latitude?: number;

@ApiProperty({ example: 10.1815, required: false })
@IsOptional()
@IsNumber()
longitude?: number;
  @ApiProperty({ example: 'Ben Salah' })
  @IsOptional()
  @IsString()
  prenom?: string;

  @ApiProperty({ example: 'ali@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: '123456789' })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiProperty({ example: 'Rue de Tunis' })
  @IsOptional()
  @IsString()
  adresse?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  estFidele?: boolean;
}
