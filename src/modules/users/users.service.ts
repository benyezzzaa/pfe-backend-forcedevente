import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';

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
      throw new BadRequestException('Email déjà utilisé');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const commercial = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: 'commercial',
    });

    return this.userRepository.save(commercial);
  }

  // ✅ Récupérer tous les commerciaux
  async findAllCommerciaux(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: 'commercial' },
      relations: ['visites'],
    });
  }

  // ❌ Supprimer un utilisateur (non utilisé dans ta version finale)
  // async deleteUser(id: number): Promise<void> { ... }

  // ✅ Liste complète (optionnel)
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // ✅ Trouver par email
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // ✅ Trouver tous les utilisateurs par rôle
  async findByRole(role?: string) {
    if (role) {
      return this.userRepository.find({ where: { role } });
    }
    return this.userRepository.find();
  }
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
  
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
  
    // Mise à jour des champs
    Object.assign(user, updateUserDto);
  
    return this.userRepository.save(user);
  }
  // ✅ Activer / Désactiver un utilisateur
  async updateStatus(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    user.isActive = true;
    return this.userRepository.save(user);
  } 
  async createAdmin(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email déjà utilisé');
  
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(dto.password, salt);
  
    const admin = this.userRepository.create({
      ...dto,
      password: hashed,
      role: 'admin',
    });
  
    return this.userRepository.save(admin);
  }
  async updatePosition(id: number, latitude: number, longitude: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Utilisateur ${id} introuvable`);
    }
  
    user.latitude = latitude;
    user.longitude = longitude;
    return await this.userRepository.save(user);
  }
  
  async getAllCommercialsWithPosition() {
    return await this.userRepository.find({
      where: { role: 'commercial', isActive: true },
      select: ['id', 'nom', 'prenom', 'latitude', 'longitude'],
    });
  }
}
