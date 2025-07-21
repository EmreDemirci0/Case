import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { ItemLevelService } from './item-level.service';

@Controller('item-levels')
export class ItemLevelController {
  constructor(private readonly itemLevelService: ItemLevelService) {}

  @Get()
  findAll() {
    return this.itemLevelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemLevelService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.itemLevelService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.itemLevelService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.itemLevelService.delete(id);
  }
}
