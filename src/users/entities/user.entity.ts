import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import { Equipment } from '../../equipment/entities/equipment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ default: 'user' })
  role!: string;

  @Column()
  number!: string;

  @Column({ select: false })
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Equipment, (Equipment) => Equipment.uploadedBy)
  equipmentUploads!: Equipment[]; // for admins, to see equipmet that was uploaded by an admin

  @OneToMany(() => Booking, (Booking) => Booking.bookedBy)
  bookings!: Booking[]; // for users, to see bookings history made by a user
}
