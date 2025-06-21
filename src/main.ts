import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // Enhanced CORS configuration
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  // Explicit OPTIONS handler middleware
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.status(204).end();
      return;
    }
    next();
  });

  // ✅ Activer validation des DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // ✅ Servir les fichiers statiques (uploads)
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // ✅ Swagger configuration avec Auth Bearer
  const config = new DocumentBuilder()
    .setTitle('API Backend Commercial')
    .setDescription("Documentation de l’API pour la gestion des commerciaux")
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

 await app.listen(4000, '0.0.0.0');
  console.log('🚀 Swagger est disponible sur http://localhost:4000/api');
}

bootstrap();
