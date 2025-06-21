  import { Module } from '@nestjs/common';
  import { TypeOrmModule } from '@nestjs/typeorm';

  import { SatisfactionService } from './satisfaction.service';
  import { SatisfactionController } from './satisfaction.controller';
  import { Client } from '../client/client.entity';
  import { User } from '../users/users.entity';
import { Satisfaction } from './satisfaction.entity';

  @Module({
    imports: [TypeOrmModule.forFeature([Satisfaction, Client, User])],
    providers: [SatisfactionService],
    controllers: [SatisfactionController],
  })
  export class SatisfactionModule {}