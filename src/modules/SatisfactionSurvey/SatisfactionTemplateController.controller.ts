import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SetRoles } from '../auth/setRoles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SatisfactionTemplateService } from './SatisfactionTemplateService.service';
import { UpdateTemplateDto } from './dto/UpdateTemplateDto';


@Controller('satisfaction/template')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SatisfactionTemplateController {
  constructor(private readonly templateService: SatisfactionTemplateService) {}

  @Get()
  @SetRoles('admin')
  getTemplate() {
    return this.templateService.getTemplate();
  }

  @Put()
  @SetRoles('admin')
  updateTemplate(@Body() dto: UpdateTemplateDto) {
    return this.templateService.updateTemplate(dto);
  }
}
