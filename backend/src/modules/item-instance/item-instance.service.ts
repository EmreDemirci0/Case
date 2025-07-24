import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemInstance } from './item-instance.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemInstanceService {
  constructor(
    @InjectRepository(ItemInstance)
    private itemInstanceRepo: Repository<ItemInstance>,
  ) {}

  async findByUserId(userId: number) {
    return this.itemInstanceRepo.find({
      where: { user: { id: userId } },
      relations: ['item'],
      order:{
        id:'ASC'
      },
    });
  }
  async findById(id: number) {
    return this.itemInstanceRepo.findOne({
      where: { id },
      relations: ['user'],
    });
  }
  
  async save(instance: ItemInstance) {
    return this.itemInstanceRepo.save(instance);
  }
}
