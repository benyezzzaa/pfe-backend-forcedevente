import { Controller, Post, Get, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { SatisfactionService } from './satisfaction.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSurveyAdminDto } from './dto/create-survey-admin.dto';
import { SetRoles } from '../auth/setRoles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('satisfaction')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SatisfactionController {
  constructor(private readonly satisfactionService: SatisfactionService) {}

  @Get()
  @SetRoles('admin')
  getAllSurveys() {
    return this.satisfactionService.findAll();
  }

    @Post('admin/create')
  @SetRoles('admin')
  create(@Body() dto: CreateSurveyAdminDto) {
    return this.satisfactionService.create(dto);
  }

  @Delete(':id')
  @SetRoles('admin')
  deleteSurvey(@Param('id') id: number) {
    return this.satisfactionService.remove(+id);
  }
}