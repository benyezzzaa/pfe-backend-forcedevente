import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateObjectifDto {
  @IsNumber()
  commercialId: number;

  @IsDateString()
  dateDebut: string;

  @IsDateString()
  dateFin: string;

  @IsNumber()
  montantCible: number;

  @IsOptional()
  @IsString()
  categorieProduit?: string;

  @IsOptional()
  @IsNumber()
  prime?: number;

  @IsOptional()
  @IsString()
  mission?: string;

  @IsOptional()
  @IsNumber()
  bonus?: number;
}
