import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ItemLevel } from './item-level.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemLevelService {
  constructor(
    @InjectRepository(ItemLevel)
    private readonly itemLevelRepository: Repository<ItemLevel>,
  ) {}
  async findByItemIdAndLevel(itemId: number, level: number): Promise<ItemLevel | null> {
    return await this.itemLevelRepository.findOne({
      where: {
        item: { id: itemId },
        level: level,
      },
      relations: ['item'],
      
    });
  }
}
