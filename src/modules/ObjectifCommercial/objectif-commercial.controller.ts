import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseIntPipe, Request, Delete, Put } from '@nestjs/common';
import { ObjectifCommercialService } from './objectif-commercial.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { SetRoles } from '../auth/setRoles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateObjectifDto } from './DTO/create-objectif.dto';
import { ObjectifCommercial } from './objectif-commercial.entity';

@ApiTags('Objectifs commerciaux')
@ApiBearerAuth()
@Controller('objectifs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ObjectifCommercialController {
  constructor(private readonly service: ObjectifCommercialService) {}

 @Post()
@SetRoles('admin')
create(@Body() dto: CreateObjectifDto) {
  console.log("📥 Reçu DTO :", dto); // 👈 Ajoute ceci
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
@UseGuards(JwtAuthGuard)
@Get('me/progress')
getMyProgress(@Request() req) {
  return this.service.getObjectifsProgress(req.user.id);
}
@Get('admin/progress')
@SetRoles('admin')
getGlobalProgress() {
  return this.service.getProgressForAdmin();
}
@Put(':id')
@SetRoles('admin')
update(@Param('id', ParseIntPipe) id: number, @Body() updateData: Partial<ObjectifCommercial>) {
  return this.service.update(id, updateData);
}

@Delete(':id')
@SetRoles('admin')
remove(@Param('id', ParseIntPipe) id: number) {
  return this.service.remove(id);
}
@Get('me/by-year')
@SetRoles('commercial')
getMyObjectifs(@Request() req) {
  return this.service.getByCommercialGroupedByYear(req.user.userId);
}
  @Put(':id/status')
  @SetRoles('admin')
  toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.service.toggleStatus(id);
  }
}
