import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { ItemInstanceService } from './item-instance.service';

@Controller('item-instances')
export class ItemInstanceController {
  constructor(private readonly itemInstanceService: ItemInstanceService) {}

  @Get()
  findAll() {
    return this.itemInstanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemInstanceService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.itemInstanceService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.itemInstanceService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.itemInstanceService.delete(id);
  }
}
