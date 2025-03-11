import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 // 🔥 Permet d’accéder aux images dans `/uploads`
 app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('API Backend Commercial')
    .setDescription('Documentation de l’API pour la gestion des commerciaux')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  
    await app.listen(3000);
    console.log('🚀 Swagger est disponible sur http://localhost:3000/api');
}
bootstrap();
