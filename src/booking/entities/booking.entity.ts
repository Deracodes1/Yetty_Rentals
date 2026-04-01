export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Equipment } from '../../equipment/entities/equipment.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status!: BookingStatus;

  @ManyToOne(() => User, (user) => user.bookings)
  bookedBy!: User;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Equipment, (equipment) => equipment.bookings)
  equipment!: Equipment;

  @CreateDateColumn()
  startDate!: Date;

  @Column()
  endDate!: Date;
}
// {
//   "data": [
//     { "id": "uuid-1", "name": "Drill", "rentingPrice": "50" },
//     { "id": "uuid-2", "name": "Ladder", "rentingPrice": "20" }
//   ],
//   "pagination": {
//     "total": 45,
//     "page": 1,
//     "lastPage": 5,
//     "limit": 10,
//     "hasNextPage": true,
//     "hasPrevPage": false
//   }
// }
