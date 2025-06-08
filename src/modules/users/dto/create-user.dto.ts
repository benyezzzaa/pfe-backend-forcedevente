import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Ali' })
  @IsString()
  nom: string;

  @ApiProperty({ example: 'Ben Salah' })
  @IsString()
  prenom: string;

  @ApiProperty({ example: 'ali.bensalah@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'MotDePasse123' })
  @IsString()
  @MinLength(6)
  password: string;

  isActive: boolean;

  @ApiProperty({ example: '555123456' })
  @IsString()
  tel: string;

  @ApiProperty({ enum: ['commercial', 'admin', 'bo'], required: false })
@IsEnum(['commercial', 'admin', 'bo'])
@IsOptional()
role?: string;
}
