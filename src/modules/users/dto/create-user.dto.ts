import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, MinLength } from 'class-validator';

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

  @ApiProperty({ example: '555123456' })
  @IsString()
  tel: string;

  @ApiProperty({ enum: ['commercial', 'admin', 'bo'] })
  @IsEnum(['commercial', 'admin', 'bo'])
  role: string;
}
