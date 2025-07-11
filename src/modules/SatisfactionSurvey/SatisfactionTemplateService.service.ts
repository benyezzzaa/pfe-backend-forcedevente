import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SatisfactionTemplate } from './SatisfactionTemplate';
import { UpdateTemplateDto } from './dto/UpdateTemplateDto';


@Injectable()
export class SatisfactionTemplateService {
  constructor(
    @InjectRepository(SatisfactionTemplate)
    private templateRepo: Repository<SatisfactionTemplate>,
  ) {}

  async getTemplate() {
  const template = await this.templateRepo.findOne({
    order: { id: 'ASC' },
  });
  if (!template) {
    const newTemplate = this.templateRepo.create();
    await this.templateRepo.save(newTemplate);
    return newTemplate;
  }
  return template;
}

  async updateTemplate(dto: UpdateTemplateDto) {
    const template = await this.getTemplate();
    Object.assign(template, dto);
    return this.templateRepo.save(template);
  }
}
