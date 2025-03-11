import { Module } from '@nestjs/common';
import { UniteController } from './unite.controller';

@Module({
  controllers: [UniteController]
})
export class UniteModule {}
