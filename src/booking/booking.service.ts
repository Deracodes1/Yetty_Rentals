import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Repository, Between, MoreThan } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LessThan, FindOptionsWhere } from 'typeorm';
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
  async findAll(
    user: User,
    page: number = 1,
    limit: number = 10,
    filters?: { status?: BookingStatus; startDate?: string; userId?: string },
  ) {
    const isAdmin = user.role === 'admin';
    const skip = (page - 1) * limit;

    // 1. Dynamic Where Clause
    const whereCondition: FindOptionsWhere<Booking> = {};

    if (!isAdmin) {
      whereCondition.bookedBy = { id: user.id };
    } else if (filters?.userId) {
      whereCondition.bookedBy = { id: filters.userId };
    }

    if (filters?.status) {
      whereCondition.status = filters.status;
    }

    if (filters?.startDate) {
      const dayStart = new Date(filters.startDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(filters.startDate);
      dayEnd.setHours(23, 59, 59, 999);
      whereCondition.startDate = Between(dayStart, dayEnd);
    }

    // 2. Combined Execution
    const [data, total] = await this.bookingRepo.findAndCount({
      where: whereCondition,
      skip,
      take: limit,
      order: { startDate: 'DESC' },
      relations: {
        equipment: true,
        bookedBy: true,
      },
      // Keeping the select strict to avoid over-fetching sensitive data
      select: {
        id: true,
        startDate: true,
        endDate: true,
        status: true,
        updatedAt: true,
        bookedBy: {
          id: true,
          name: true,
          email: true,
        },
        equipment: {
          id: true,
          name: true,
          rentingPrice: true,
          type: true,
        },
      },
    });

    const lastPage = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        lastPage,
        hasNextPage: page < lastPage,
        hasPrevPage: page > 1,
      },
    };
  }

  // GET ONE (Ownership Protected)
  async findOne(id: string, user: User) {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['bookedBy', 'equipment'],
    });

    if (!booking) throw new NotFoundException();

    if (user.role !== 'admin' && booking.bookedBy.id !== user.id) {
      throw new ForbiddenException();
    }

    // Check if we actually NEED to update before calling the database again
    const now = new Date();
    if (
      new Date(booking.endDate) < now &&
      booking.status !== BookingStatus.COMPLETED
    ) {
      booking.status = BookingStatus.COMPLETED;

      return await this.bookingRepo.save(booking);
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
  // booking.service.ts

  async updateStatus(id: string, newStatus: BookingStatus, user: User) {
    const booking = await this.findOne(id, user); // Reuses our ownership/admin check

    // Business Logic: Define allowed transitions
    const now = new Date();

    if (
      newStatus === BookingStatus.COMPLETED &&
      new Date(booking.endDate) > now
    ) {
      throw new BadRequestException(
        'Cannot mark as completed before the end date has passed.',
      );
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException(
        'Cannot update a booking that is already cancelled.',
      );
    }

    booking.status = newStatus;
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

  @Cron(CronExpression.EVERY_HOUR)
  async handleAutoCompletion() {
    const now = new Date();

    // Bulk update: find confirmed bookings where endDate is in the past
    const result = await this.bookingRepo.update(
      {
        status: BookingStatus.CONFIRMED,
        endDate: LessThan(now),
      },
      {
        status: BookingStatus.COMPLETED,
      },
    );

    if (result.affected && result.affected > 0) {
      console.log(`[Cron] Auto-completed ${result.affected} bookings.`);
    }
  }
}
