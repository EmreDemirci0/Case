import { Controller, Get, Post, Param, Body, Put, Delete, UseGuards, Request, UnauthorizedException, Req, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ItemInstanceService } from './item-instance.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { AppSettingService } from '../app-setting/app-setting.service';

@Controller('item-instances')
export class ItemInstanceController {
  constructor(private readonly itemInstanceService: ItemInstanceService,
    private readonly userService: UserService,
    private readonly appSettingService: AppSettingService,
  ) { }
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.itemInstanceService.findByUserId(Number(userId));
  }


  @UseGuards(JwtAuthGuard)
  @Post('progress')
  async getProgress(@Req() req, @Body() body: { cardId: number }) {
    // console.log(body.cardId)
    const itemInstance = await this.itemInstanceService.findById(body.cardId);
    console.log(itemInstance, body.cardId);
    if (!itemInstance || itemInstance.user.id !== req.user.userId) {
      throw new UnauthorizedException();
    }

    return {
      progress: itemInstance.progress,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('increase-progress')
  async increaseProgress(@Request() req, @Body() body: { cardId: number; increment: number }) {
    const itemInstance = await this.itemInstanceService.findById(body.cardId);
    if (!itemInstance || itemInstance.user.id !== req.user.userId) {
      throw new UnauthorizedException();
    }

    const increment = body.increment || 1; // artırma miktarı (örneğin %2 için 2)

    itemInstance.progress += increment;

    if (itemInstance.progress > 100) {
      itemInstance.progress = 100;
    }

    await this.itemInstanceService.save(itemInstance);

    return {
      progress: itemInstance.progress,
    };
  }



  @UseGuards(JwtAuthGuard)
  @Post('level-up')
  async levelUp(@Request() req, @Body() body: { cardId: number }) {
    const itemInstance = await this.itemInstanceService.findById(body.cardId);

    if (!itemInstance || itemInstance.user.id !== req.user.userId) {
      throw new UnauthorizedException();
    }

    const maxLevelStr = await this.appSettingService.getSetting('max_item_level') || "";
    const maxLevel = parseInt(maxLevelStr, 10);
    if (isNaN(maxLevel)) {
      throw new InternalServerErrorException('Geçersiz max_item_level ayarı.');
    }

    if (itemInstance.currentLevel >= maxLevel) {
      throw new BadRequestException(`Maksimum seviye olan ${maxLevel}'a ulaşıldı.`);
    }


    itemInstance.currentLevel += 1;
    itemInstance.progress = 0;

    await this.itemInstanceService.save(itemInstance);

    return {
      level: itemInstance.currentLevel,
      progress: 0,
    };
  }

}
