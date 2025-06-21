  import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { ILike, Repository } from 'typeorm';
  import { Satisfaction } from './satisfaction.entity';
  import { CreateSurveyAdminDto } from './dto/create-survey-admin.dto';
  import { User } from '../users/users.entity';
  import { Client } from '../client/client.entity';

  @Injectable()
  export class SatisfactionService {
    constructor(
      @InjectRepository(Satisfaction)
      private satisfactionRepository: Repository<Satisfaction>,

      @InjectRepository(User)
      private userRepository: Repository<User>,

      @InjectRepository(Client)
      private clientRepository: Repository<Client>,
      @InjectRepository(Satisfaction)
      private satisfactionRepo: Repository<Satisfaction>,
      @InjectRepository(User)
      private userRepo: Repository<User>,
      @InjectRepository(Client)
      private clientRepo: Repository<Client>,
    ) {}

    async findAll() {
      return this.satisfactionRepository.find({
        relations: ['commercial', 'client'],
        order: { createdAt: 'DESC' },
      });
    }

  async create(dto: CreateSurveyAdminDto) {
    console.log('📥 Données reçues:', dto);

    if (!dto.nomCommercial || !dto.prenomCommercial) {
      throw new BadRequestException('Champs manquants');
    }

    const commercial = await this.userRepository.findOne({
      where: {
        nom: ILike(dto.nomCommercial),
        prenom: ILike(dto.prenomCommercial)
      }
    });

    if (!commercial) throw new NotFoundException('Commercial non trouvé');

    const client = await this.clientRepository.findOne({ order: { id: 'DESC' } });

    if (!client) throw new NotFoundException('Client non trouvé');

    const newSurvey = this.satisfactionRepository.create({
      commercial,
      client,
      isCompleted: false,
    });

    return this.satisfactionRepository.save(newSurvey);
  }

    async remove(id: number) {
      const survey = await this.satisfactionRepository.findOne({ where: { id } });
      if (!survey) throw new NotFoundException('❌ Enquête non trouvée');
      return this.satisfactionRepository.remove(survey);
    }
  }
