import { Controller, Get, Param, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { ItemLevelService } from './item-level.service';
import { ItemLevelTranslationService } from '../item-level-translation/item-level-translation.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('item-levels')
@UseGuards(JwtAuthGuard)  
export class ItemLevelController {
  constructor(
    private readonly itemLevelService: ItemLevelService,
    private readonly itemLevelTranslationService: ItemLevelTranslationService,
  ) {}

  @Get('item/:itemId/level/:level')
  async getByItemAndLevel(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Param('level', ParseIntPipe) level: number,
    @Query('lang') lang: string = 'en',
  ) {
    const itemLevel = await this.itemLevelService.findByItemIdAndLevel(itemId, level);
    if (!itemLevel) {
      return { message: 'Kayıt bulunamadı' };
    }

    const translation = await this.itemLevelTranslationService.findByItemLevelIdAndLang(itemLevel.id, lang);

    return {
      ...itemLevel,
      title: translation?.title ?? null,
      description: translation?.description ?? null,
    };
  }
}
