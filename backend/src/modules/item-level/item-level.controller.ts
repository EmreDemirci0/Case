import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ItemLevelService } from './item-level.service';

@Controller('item-levels')
export class ItemLevelController {
  constructor(private readonly itemLevelService: ItemLevelService) {}

  // Örnek GET isteği: /item-levels/item/1/level/1
  //jwt ekle
  @Get('item/:itemId/level/:level')
  async getByItemAndLevel(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Param('level', ParseIntPipe) level: number,
  ) {
    const itemLevel = await this.itemLevelService.findByItemIdAndLevel(itemId, level);
    if (!itemLevel) {
      return { message: 'Kayıt bulunamadı' };
    }
    return itemLevel;
  }
}
