import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dto/login-user.dto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private resetTokens: Map<string, string> = new Map(); // token -> email (in-memory)

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByEmail(loginUserDto.email);
    
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }
  
    const passwordMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Mot de passe incorrect');
    }
  
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
  
    return { access_token: token, user };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const token = uuidv4(); // Génère un token unique
    this.resetTokens.set(token, email); // Stocke le token temporairement

    return {
      message: 'Un lien de réinitialisation a été généré.',
      resetLink: `http://localhost:3000/reset-password?token=${token}`, // à remplacer par ton frontend
      token // utile pour tester en Postman
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const email = this.resetTokens.get(token);
    if (!email) {
      throw new BadRequestException('Token invalide ou expiré');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(email, hashedPassword);

    this.resetTokens.delete(token); // Supprime le token après usage

    return { message: 'Mot de passe réinitialisé avec succès' };
  }
}
