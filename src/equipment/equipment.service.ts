// equipment.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipment } from './entities/equipment.entity';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { User } from '../users/entities/user.entity';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment)
    private readonly repo: Repository<Equipment>,
  ) {}

  async create(dto: CreateEquipmentDto, admin: User) {
    const equipment = this.repo.create({
      ...dto,
      uploadedBy: admin, // Links the admin who uploaded it
    });
    return await this.repo.save(equipment);
    //  'Equipment uploaded sucessfully';
  }

  // equipment.service.ts
  async findAll(page: number, limit: number) {
    const [items, total] = await this.repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['uploadedBy'],
      order: { createdAt: 'DESC' },
    });

    return {
      data: items,
      pagination: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const equipment = await this.repo.findOne({
      where: { id },
      relations: ['bookings'],
    });
    if (!equipment) throw new NotFoundException('Equipment not found');
    return equipment;
  }

  async update(id: string, dto: UpdateEquipmentDto) {
    const equipment = await this.repo.preload({ id, ...dto });
    if (!equipment) throw new NotFoundException('Equipment not found');
    return await this.repo.save(equipment);
  }

  async remove(id: string) {
    const equipment = await this.findOne(id);
    return await this.repo.remove(equipment);
  }
}
