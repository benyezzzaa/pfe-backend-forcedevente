import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ObjectifCommercialService } from './objectif-commercial.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { SetRoles } from '../auth/setRoles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateObjectifDto } from './DTO/create-objectif.dto';

@ApiTags('Objectifs commerciaux')
@ApiBearerAuth()
@Controller('objectifs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ObjectifCommercialController {
  constructor(private readonly service: ObjectifCommercialService) {}

  @Post()
  @SetRoles('admin')
  create(@Body() dto: CreateObjectifDto) {
    return this.service.create(dto);
  }

  @Get()
  @SetRoles('admin')
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id/status')
  @SetRoles('admin')
  toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.service.toggleStatus(id);
  }
}
