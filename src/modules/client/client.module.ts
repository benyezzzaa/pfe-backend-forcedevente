import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './client.entity'; // ✅ Import de l'entité Client
import { ClientService } from './client.service';
import { ClientController } from './client.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Client])], // ✅ IMPORTANT
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService], // ✅ Si d'autres modules en ont besoin
})
export class ClientModule {}
