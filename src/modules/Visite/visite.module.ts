import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visite } from './visite.entity';
import { VisiteService } from './visite.service';
import { VisiteController } from './visite.controller';
import { Client } from '../client/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Visite, Client])],
  controllers: [VisiteController],
  providers: [VisiteService],
  exports: [VisiteService],
})
export class VisiteModule {}
