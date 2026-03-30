import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Booking } from './entities/booking.entity';
import { Repository, MoreThan } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
// booking.service.ts
@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}
  async create(dto: CreateBookingDto, user: User) {
    // 1. Check for overlapping bookings (N+1 safe)
    const overlap = await this.bookingRepo.findOne({
      where: {
        equipment: { id: dto.equipmentId },
        // Logic: Is there a booking where the end date hasn't passed yet?
        endDate: MoreThan(new Date()),
      },
    });

    if (overlap) {
      throw new ConflictException('Equipment is currently unavailable/rented.');
    }

    // 2. Create the record
    const newBooking = this.bookingRepo.create({
      endDate: dto.endDate,
      bookedBy: user,
      equipment: { id: dto.equipmentId },
    });

    return await this.bookingRepo.save(newBooking);
  }
  // GET ALL (Filtered by Role)
  async findAll(user: User) {
    const isAdmin = user.role === 'admin';

    return await this.bookingRepo.find({
      // 1. Filter: If not admin, only show user's bookings
      where: isAdmin ? {} : { bookedBy: { id: user.id } },

      // 2. The N+1 Fix: Join these tables immediately
      relations: {
        equipment: true,
        bookedBy: true,
      },

      // 3. Select only needed fields (Optional, for performance)
      select: {
        bookedBy: {
          id: true,
          name: true,
          email: true,
        },
        equipment: {
          id: true,
          name: true,
          rentingPrice: true,
        },
      },
    });
  }

  // GET ONE (Ownership Protected)
  async findOne(id: string, user: User) {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['bookedBy', 'equipment'],
    });

    if (!booking) throw new NotFoundException();

    // Check if user is Admin OR the owner
    if (user.role !== 'admin' && booking.bookedBy.id !== user.id) {
      throw new ForbiddenException('Access denied');
    }
    return booking;
  }

  // PATCH (Ownership + Date Protected)
  async update(id: string, updateDto: any, user: User) {
    const booking = await this.findOne(id, user);

    if (new Date(booking.startDate) <= new Date()) {
      throw new BadRequestException('Cannot modify active or past bookings');
    }

    Object.assign(booking, updateDto);
    return await this.bookingRepo.save(booking);
  }

  // DELETE (Ownership + Date Protected)
  async remove(id: string, user: User) {
    const booking = await this.findOne(id, user);

    if (new Date(booking.startDate) <= new Date()) {
      throw new BadRequestException('Cannot delete active or past bookings');
    }

    return await this.bookingRepo.remove(booking);
  }
}
