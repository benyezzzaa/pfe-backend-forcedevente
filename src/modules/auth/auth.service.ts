import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService, // ✅ injection du Mailer
  ) {}

  private resetTokens: Map<string, string> = new Map(); // token -> email

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

    const token = uuidv4();
    this.resetTokens.set(token, email);

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <h2>Demande de réinitialisation de mot de passe</h2>
        <p>Bonjour ${user.prenom || ''},</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous :</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.</p>
      `,
    });

    return {
      message: 'Un lien de réinitialisation a été envoyé à votre adresse email.',
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

    this.resetTokens.delete(token);

    return { message: 'Mot de passe réinitialisé avec succès' };
  }
}
