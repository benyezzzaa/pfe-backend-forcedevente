import {
    Controller,
    Post,
    Get,
    Patch,
    Param,
    Body,
    UseGuards,
    ParseIntPipe,
  } from '@nestjs/common';
 

  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { RolesGuard } from '../auth/roles.guard';
  import { SetRoles } from '../auth/setRoles.decorator';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePromotionDto } from './DTO/CreatePromotionDto.dto';
import { PromotionService } from './Promotion.Service';
  
  @ApiTags('Promotions')
  @ApiBearerAuth()
  @Controller('promotions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class PromotionController {
    constructor(private readonly promoService: PromotionService) {}
  
    @Post()
    @SetRoles('admin')
    create(@Body() dto: CreatePromotionDto) {
      return this.promoService.create(dto);
    }
  
    @Get()
    @SetRoles('admin')
    findAll() {
      return this.promoService.findAll();
    }
  
    @Patch(':id')
    @SetRoles('admin')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: CreatePromotionDto,
    ) {
      return this.promoService.update(id, dto);
    }
  
    @Patch(':id/status')
    @SetRoles('admin')
    toggleStatus(@Param('id', ParseIntPipe) id: number) {
      return this.promoService.toggleStatus(id);
    }
  }
  