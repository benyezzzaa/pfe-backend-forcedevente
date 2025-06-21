import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateSurveyAdminDto {
     @IsString()
  @IsNotEmpty()
  nomCommercial: string;

  @IsString()
  @IsNotEmpty()
  prenomCommercial: string;
}