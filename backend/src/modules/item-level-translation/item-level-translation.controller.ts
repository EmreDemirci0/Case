import { Controller, Get, Param, Query } from '@nestjs/common';
import { ItemLevelTranslationService } from './item-level-translation.service';

@Controller('item-level-translation')
export class ItemLevelTranslationController {
  constructor(private readonly service: ItemLevelTranslationService) {}

  @Get(':itemLevelId')
  async getTranslation(
    @Param('itemLevelId') itemLevelId: number,
    @Query('lang') lang: string,
  ) {
    return this.service.findByItemLevelIdAndLang(itemLevelId, lang);
  }
}
