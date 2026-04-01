// equipment.controller.ts
import {
  Controller,
  Query,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { JwtAuthGuard } from '../guards/jwt-auth-guard/jwt-auth-guard';
import { RolesGuard } from '../guards/role-guard/role-guard';
import { Roles } from '../decorators/roles.decorator';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Controller('equipment')
@UseGuards(JwtAuthGuard, RolesGuard) // All routes require login + Role check
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post()
  @Roles('admin') // Only Admins can hit this
  create(@Body() dto: CreateEquipmentDto, @GetUser() user: User) {
    return this.equipmentService.create(dto, user);
  }

  // authenticated user
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    // Ensure we are passing numbers to the service
    return this.equipmentService.findAll(page, limit);
  }

  @Get(':id') // Any authenticated user
  findOne(@Param('id') id: string) {
    return this.equipmentService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateEquipmentDto) {
    return this.equipmentService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.equipmentService.remove(id);
  }
}
