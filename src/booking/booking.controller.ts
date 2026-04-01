import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Patch,
  Param,
  Delete,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingStatus } from './entities/booking.entity';
import { JwtAuthGuard } from '../guards/jwt-auth-guard/jwt-auth-guard';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../decorators/get-user.decorator';
import { RolesGuard } from '../guards/role-guard/role-guard';
@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(RolesGuard)
  @Post()
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @GetUser() user: User,
  ) {
    return this.bookingService.create(createBookingDto, user);
  }

  @Get()
  // booking.controller.ts
  @Get()
  async findAll(
    @GetUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: BookingStatus,
    @Query('startDate') startDate?: string,
    @Query('userId') userId?: string,
  ) {
    // Pass the typed values directly
    return this.bookingService.findAll(user, page, limit, {
      status,
      startDate,
      userId,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.bookingService.findOne(id, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @GetUser() user: User,
  ) {
    return this.bookingService.update(id, updateBookingDto, user);
  }
  // booking.controller.ts

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: BookingStatus,
    @GetUser() user: User,
  ) {
    return this.bookingService.updateStatus(id, status, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user: User) {
    return this.bookingService.remove(id, user);
  }
}
