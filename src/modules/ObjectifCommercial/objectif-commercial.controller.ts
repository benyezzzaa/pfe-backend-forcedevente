import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
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
@Get('me/sales-by-category')
@SetRoles('commercial')
getMySalesByCategory(@Request() req) {
  return this.service.getSalesByCategory(req.user.userId);
}
  @Get()
  @SetRoles('admin')
  findAll() {
    return this.service.findAll();
  }
@Get('me/by-year')
@SetRoles('commercial')
getMyObjectifs(@Request() req) {
  return this.service.getByCommercialGroupedByYear(req.user.userId);
}
  @Patch(':id/status')
  @SetRoles('admin')
  toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.service.toggleStatus(id);
  }
}
