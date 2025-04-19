import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './promotion.entity';
import { CreatePromotionDto } from './DTO/CreatePromotionDto.dto';


@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promoRepo: Repository<Promotion>,
  ) {}

  async create(dto: CreatePromotionDto): Promise<Promotion> {
    const promo = this.promoRepo.create(dto);
    return await this.promoRepo.save(promo);
  }

  findAll(): Promise<Promotion[]> {
    return this.promoRepo.find();
  }

  async update(id: number, dto: CreatePromotionDto): Promise<Promotion> {
    const promo = await this.promoRepo.findOneBy({ id });
    if (!promo) {
      throw new NotFoundException('Promotion introuvable');
    }
    Object.assign(promo, dto);
    return await this.promoRepo.save(promo);
  }

  async toggleStatus(id: number): Promise<Promotion> {
    const promo = await this.promoRepo.findOneBy({ id });
    if (!promo) {
      throw new NotFoundException('Promotion introuvable');
    }
    promo.isActive = !promo.isActive;
    return await this.promoRepo.save(promo);
  }
}
