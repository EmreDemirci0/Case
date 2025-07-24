import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ItemInstanceService } from './item-instance.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('item-instances')
export class ItemInstanceController {
  constructor(private readonly itemInstanceService: ItemInstanceService,
  ) { }
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.itemInstanceService.findByUserId(Number(userId));
  }

}
