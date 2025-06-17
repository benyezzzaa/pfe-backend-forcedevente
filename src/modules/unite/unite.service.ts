import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unite } from './unite.entity';
import { CreateUniteDto } from './dto/CreateUniteDto';

@Injectable()
export class UniteService {
  constructor(
    @InjectRepository(Unite)
    private uniteRepository: Repository<Unite>,
  ) {}

  async create(dto: CreateUniteDto): Promise<Unite> {
    const unite = this.uniteRepository.create(dto);
    return await this.uniteRepository.save(unite);
  }

  async findAll(): Promise<Unite[]> {
    return await this.uniteRepository.find();
  }

  async findOne(id: number): Promise<Unite> {
    const unite = await this.uniteRepository.findOne({ where: { id } });
    if (!unite) {
      throw new NotFoundException(`Unité avec l'ID ${id} non trouvée`);
    }
    return unite;
  }

  async update(id: number, dto: CreateUniteDto): Promise<Unite> {
    const unite = await this.findOne(id);
    Object.assign(unite, dto);
    return await this.uniteRepository.save(unite);
  }
async toggleStatus(id: number, isActive: boolean): Promise<Unite> {
  const unite = await this.findOne(id);
  unite.isActive = isActive;
  return this.uniteRepository.save(unite);
}
  async delete(id: number): Promise<void> {
    const unite = await this.findOne(id);
    await this.uniteRepository.remove(unite);
  }
}
