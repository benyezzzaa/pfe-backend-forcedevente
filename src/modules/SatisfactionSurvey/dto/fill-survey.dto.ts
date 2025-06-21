import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class FillSurveyDto {
  @IsInt() @Min(1) @Max(5)
  noteGlobale: number;

  @IsInt() @Min(1) @Max(5)
  serviceCommercial: number;

  @IsInt() @Min(1) @Max(5)
  livraison: number;

  @IsBoolean()
  gammeProduits: boolean;

  @IsBoolean()
  recommandation: boolean;

  @IsOptional() @IsString()
  commentaire?: string;
}
