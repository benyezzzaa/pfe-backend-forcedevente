import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ✅ Autoriser les requêtes CORS depuis le frontend
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
    credentials: true,
  });
  // 🔥 Activer la validation des DTOs
  app.useGlobalPipes( new ValidationPipe({
    whitelist: true,
    transform: true, // Très important pour DTOs (sinon le body est vide)
  }));

  // ✅ Appliquer le `JwtAuthGuard` globalement, mais attention à Swagger


  // 🔥 Permet d’accéder aux images dans `/uploads`
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Configuration Swagger avec Authentification Bearer
  const config = new DocumentBuilder()
    .setTitle('API Backend Commercial')
    .setDescription('Documentation de l’API pour la gestion des commerciaux')
    .setVersion('1.0')
    .addBearerAuth() // 🔐 Ajout du Token dans Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors(); // 👈 Obligatoire si frontend ≠ backend
  await app.listen(4000);
  console.log('🚀 Swagger est disponible sur http://localhost:4000/api');
}
bootstrap();
