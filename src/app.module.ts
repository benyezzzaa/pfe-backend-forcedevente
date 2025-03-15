import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProduitModule } from './modules/produit/produit.module';
import { User } from './modules/users/users.entity';
import { CategorieProduitModule } from './modules/categorie-produit/categorie-produit.module';
import { UniteService } from './modules/unite/unite.service';
import { UniteModule } from './modules/unite/unite.module';
import { Client } from './modules/client/client.entity';
import { ClientModule } from './modules/client/client.module';
import { Unite } from './modules/unite/unite.entity';

import { VisiteModule } from './modules/Visite/visite.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'fatma',
      database: process.env.DATABASE_NAME || 'postgres',
      autoLoadEntities: true,
      synchronize: true,
      entities: [User,Client,Unite], // 🔥 Vérifie que `User` est bien importé ici
    }),
    UsersModule,
    AuthModule,
    ProduitModule,
    CategorieProduitModule,
    UniteModule,
    ClientModule,
    UniteModule ,
    VisiteModule,// 🔥 Vérifie que c'est bien importé
  ],
  providers: [],
})
export class AppModule {}
