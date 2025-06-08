import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dto/login-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByEmail(loginUserDto.email);
    
    if (!user) {
      console.log("❌ Utilisateur non trouvé !");
      throw new UnauthorizedException('Utilisateur non trouvé');
    }
  
    console.log("✅ Utilisateur trouvé en base :", user);
  
    // 🔍 Vérification du mot de passe
    const passwordMatch = await bcrypt.compare(loginUserDto.password, user.password);
  
    if (!passwordMatch) {
      console.log("❌ Mot de passe incorrect !");
      throw new UnauthorizedException('Mot de passe incorrect');
    }
  
    console.log("✅ Mot de passe valide, génération du token...");
  
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
  
    console.log("✅ Token généré :", token); // 🔥 Ajoute ça pour voir le token en console
  
    return { access_token: token ,user:user};
  }
}
