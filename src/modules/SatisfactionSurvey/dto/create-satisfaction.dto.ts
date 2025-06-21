import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSatisfactionDto {
  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsInt() @Min(1) @Max(5)
  noteGlobale: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt() @Min(1) @Max(5)
  serviceCommercial: number;

  @ApiProperty({ example: 3, minimum: 1, maximum: 5 })
  @IsInt() @Min(1) @Max(5)
  livraison: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  gammeProduits: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  recommandation: boolean;

  @ApiProperty({ example: "Service excellent, mais délais longs", required: false })
  @IsOptional()
  @IsString()
  commentaire?: string;
}
