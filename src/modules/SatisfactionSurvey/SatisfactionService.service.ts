import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Satisfaction } from './satisfaction.entity';

import { User } from '../users/users.entity';
import { Client } from '../client/client.entity';
import { FillSurveyDto } from './dto/fill-survey.dto';
import { SatisfactionTemplate } from './SatisfactionTemplate';

@Injectable()
export class SatisfactionService {
  constructor(
    @InjectRepository(Satisfaction)
    private satisfactionRepo: Repository<Satisfaction>,
    @InjectRepository(SatisfactionTemplate)
    private templateRepo: Repository<SatisfactionTemplate>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Client)
    private clientRepo: Repository<Client>,
  ) {}

  async findAll() {
    return this.satisfactionRepo.find({
      relations: ['commercial', 'client'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCommercial(commercialId: number) {
    return this.satisfactionRepo.find({
      where: { commercial: { id: commercialId } },
      relations: ['commercial', 'client'],
      order: { createdAt: 'DESC' },
    });
  }

  async createForCommercial(commercialId: number) {
    const commercial = await this.userRepo.findOne({ where: { id: commercialId } });
    if (!commercial) throw new NotFoundException('Commercial non trouvé');

    const template = await this.templateRepo.findOneBy({});
    if (!template) throw new NotFoundException('Template non défini');

    const newSurvey = this.satisfactionRepo.create({
      commercial,
      isCompleted: false,
      noteGlobale: template.noteGlobale,
      serviceCommercial: template.serviceCommercial,
      livraison: template.livraison,
      gammeProduits: template.gammeProduits,
      recommandation: template.recommandation,
      commentaire: template.description,
    });

    return this.satisfactionRepo.save(newSurvey);
  }

  async complete(id: number, dto: FillSurveyDto) {
    const survey = await this.satisfactionRepo.findOne({
      where: { id },
      relations: ['commercial', 'client'],
    });
    if (!survey) throw new NotFoundException('Enquête non trouvée');
    if (survey.isCompleted) throw new BadRequestException('Enquête déjà complétée');

    const client = await this.clientRepo.findOne({ where: { id: dto.clientId } });
    if (!client) throw new NotFoundException('Client non trouvé');

    Object.assign(survey, {
      client,
      noteGlobale: dto.noteGlobale,
      serviceCommercial: dto.serviceCommercial,
      livraison: dto.livraison,
      gammeProduits: dto.gammeProduits,
      recommandation: dto.recommandation,
      commentaire: dto.commentaire,
      isCompleted: true,
    });

    return this.satisfactionRepo.save(survey);
  }

  async remove(id: number) {
    const survey = await this.satisfactionRepo.findOne({ where: { id } });
    if (!survey) throw new NotFoundException('Enquête non trouvée');
    return this.satisfactionRepo.remove(survey);
  }
}
