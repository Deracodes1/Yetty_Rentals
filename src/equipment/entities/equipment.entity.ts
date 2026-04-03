import {
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn('uuid') // Matches User/Booking UUID style
  id!: string;

  @Column()
  name!: string;

  @Column()
  rentingPrice!: string;

  @Column()
  type!: string;

  @ManyToOne(() => User, (user) => user.equipmentUploads)
  uploadedBy!: User;

  @OneToMany(() => Booking, (booking) => booking.equipment)
  bookings!: Booking[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
