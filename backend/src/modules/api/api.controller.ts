import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  UnauthorizedException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { ItemInstanceService } from '../item-instance/item-instance.service';
import { AppSettingService } from '../app-setting/app-setting.service';

@UseGuards(JwtAuthGuard)
@Controller('api')
export class ApiController {
  constructor(
    private readonly userService: UserService,
    private readonly itemInstanceService: ItemInstanceService,
    private readonly appSettingService: AppSettingService
  ) { }

  //1️⃣ Enerji Bilgisi
  @UseGuards(JwtAuthGuard)
  @Get('/energy')
  async getEnergy(@Req() req) {
    try {
      const user = await this.userService.getUserById(req.user.userId);
      if (!user) {
        return null;
      }
      const energy = await this.userService.getCurrentEnergy(user);
      const lastEnergyUpdateAt = user.lastEnergyUpdateAt;
      return { energy, lastEnergyUpdateAt };
    } catch (error) {
      return null;
    }
  }

  // 2️⃣ Enerji Tüketimi
  @UseGuards(JwtAuthGuard)
  @Post('/energy/consume')
  async consumeEnergy(@Req() req, @Body() body: { amount: number }) {
    const userId = req.user.userId;
    const amount = body.amount;

    const success = await this.userService.consumeEnergy(userId, amount);
    return {
      success,
      message: success
        ? 'Enerji başarıyla harcandı.'
        : 'Yeterli enerjiniz yok.',
    };
  }

  // 3️⃣ Progress Getir
  @Post('progress')
  async getProgress(@Req() req, @Body() body: { cardId: number }) {
    const item = await this.itemInstanceService.findById(body.cardId);
    if (!item || item.user.id !== req.user.userId)
      throw new UnauthorizedException();

    const energy = await this.userService.getCurrentEnergy(item.user);

    return {
      progress: item.progress,
      energy,
    };
  }

  // 4️⃣ Progress Artır
  @Post('increase-progress')
  async increaseProgress(
    @Req() req,
    @Body() body: { cardId: number; increment: number }
  ) {
    const item = await this.itemInstanceService.findById(body.cardId);
    if (!item || item.user.id !== req.user.userId)
      throw new UnauthorizedException();

    const increment = body.increment || 1;
    item.progress += increment;
    if (item.progress > 100) item.progress = 100;

    await this.itemInstanceService.save(item);
    return { progress: item.progress };
  }

  // 5️⃣ Seviye Atlama
  @Post('level-up')
  async levelUp(@Req() req, @Body() body: { cardId: number }) {
    const item = await this.itemInstanceService.findById(body.cardId);
    if (!item || item.user.id !== req.user.userId)
      throw new UnauthorizedException();

    const maxLevelStr =
      (await this.appSettingService.getSetting('max_item_level')) || '0';
    const maxLevel = parseInt(maxLevelStr, 10);

    if (item.currentLevel >= maxLevel)
      throw new BadRequestException(
        `Maksimum seviye olan ${maxLevel}'a ulaşıldı.`
      );

    item.currentLevel += 1;
    item.progress = 0;
    await this.itemInstanceService.save(item);

    return {
      level: item.currentLevel,
      progress: 0,
    };
  }
}
