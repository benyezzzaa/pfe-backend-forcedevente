import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Satisfaction } from './satisfaction.entity';

import { SatisfactionController } from './satisfaction.controller';

import { Client } from '../client/client.entity';
import { User } from '../users/users.entity';
import { SatisfactionTemplate } from './SatisfactionTemplate';
import { SatisfactionTemplateController } from './SatisfactionTemplateController.controller';
import { SatisfactionTemplateService } from './SatisfactionTemplateService.service';
import { SatisfactionService } from './SatisfactionService.service';

@Module({
  imports: [TypeOrmModule.forFeature([Satisfaction, SatisfactionTemplate, Client, User])],
  controllers: [SatisfactionController, SatisfactionTemplateController],
  providers: [SatisfactionService, SatisfactionTemplateService],
})
export class SatisfactionModule {}
