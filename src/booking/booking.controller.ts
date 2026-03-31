import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BookingService } from './booking.service';
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
  async findAll(@GetUser() user: User) {
    return this.bookingService.findAll(user);
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

  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user: User) {
    return this.bookingService.remove(id, user);
  }
}
