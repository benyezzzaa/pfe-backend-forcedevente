import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Delete,
  Param,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SetRoles } from '../auth/setRoles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { FillSurveyDto } from './dto/fill-survey.dto';
import { SatisfactionService } from './SatisfactionService.service';

@Controller('satisfaction')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SatisfactionController {
  constructor(private readonly satisfactionService: SatisfactionService) {}

  @Get()
  @SetRoles('admin')
  getAllSurveys() {
    return this.satisfactionService.findAll();
  }

  @Get('me')
  @SetRoles('commercial')
  getMySurveys(@Req() req: any) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('Utilisateur non connecté');
    return this.satisfactionService.findByCommercial(userId);
  }

  @Post('create')
  @SetRoles('commercial')
  createForCommercial(@Req() req: any) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('Utilisateur non connecté');
    return this.satisfactionService.createForCommercial(userId);
  }

  @Put(':id/complete')
  @SetRoles('commercial')
  complete(@Param('id') id: number, @Body() dto: FillSurveyDto) {
    return this.satisfactionService.complete(+id, dto);
  }

  @Delete(':id')
  @SetRoles('admin')
  deleteSurvey(@Param('id') id: number) {
    return this.satisfactionService.remove(+id);
  }
}
