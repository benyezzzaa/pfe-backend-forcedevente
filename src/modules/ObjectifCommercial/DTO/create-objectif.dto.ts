import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateObjectifDto {
@IsNumber()
commercialId: number;

@IsDateString()
dateDebut: string;

@IsDateString()
dateFin: string;

@IsNumber()
prime: number;

@IsNumber()
@IsOptional()
pourcentageCible?: number;

@IsString()
@IsOptional()
categorieProduit?: string;

@IsString()
@IsOptional()
mission?: string;
}
