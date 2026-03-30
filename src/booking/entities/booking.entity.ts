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
