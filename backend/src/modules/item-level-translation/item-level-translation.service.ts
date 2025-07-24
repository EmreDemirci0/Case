import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemLevelTranslation } from './item-level-translation.entity';

@Injectable()
export class ItemLevelTranslationService {
  constructor(
    @InjectRepository(ItemLevelTranslation)
    private readonly repo: Repository<ItemLevelTranslation>,
  ) {}

  async findByItemLevelIdAndLang(itemLevelId: number, lang: string) {
    return this.repo.findOne({
      where: {
        itemLevel: { id: itemLevelId },
        lang,
      },
    });
  }
}
