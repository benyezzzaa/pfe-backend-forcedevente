import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // ✅ Créer un commercial
  async createCommercial(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new Error('Email déjà utilisé');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const commercial = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: 'commercial', // 🔥 On force "commercial"
    });

    return this.userRepository.save(commercial);
  }

  // ✅ Récupérer tous les commerciaux
  async findAllCommerciaux(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: 'commercial' },
    });
  }

  // ✅ Supprimer un utilisateur
  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    await this.userRepository.remove(user);
  }

  // ✅ Récupérer tous les utilisateurs (optionnel)
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // ✅ Trouver un utilisateur par email
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
