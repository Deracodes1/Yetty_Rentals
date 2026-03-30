import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  @IsNotEmpty()
  equipmentId!: string;

  @IsDateString()
  @IsNotEmpty()
  endDate!: string;
}
