
import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { AppSettingService } from './app-setting.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { BaseResponse } from 'src/_base/base.response';

@Controller()
export class AppSettingController {
  constructor(private readonly appSettingService: AppSettingService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/app-settings')
  async getAppSettings() {
    const maxEnergy = await this.appSettingService.getSetting('max_energy');
    const regenMinutes = await this.appSettingService.getSetting('energy_regen_minutes');
    const maxItemLevel=await this.appSettingService.getSetting('max_item_level');
    return new BaseResponse({ maxEnergy, regenMinutes,maxItemLevel }, true, "Ayarlar getirildi");
  }
  // // Ayarı anahtarla al
  // @UseGuards(JwtAuthGuard) // Opsiyonel: admin koruması varsa ekle
  // @Get(':key')
  // async getSetting(@Param('key') key: string) {
  //   const value = await this.appSettingService.getSetting(key);
  //   return { key, value };
  // }

  // // Ayar ekle veya güncelle
  // @UseGuards(JwtAuthGuard) // Yine admin koruması için
  // @Post()
  // async upsertSetting(@Body() body: { key: string; value: string }) {
  //   const updated = await this.appSettingService.upsertSetting(body.key, body.value);
  //   return updated;
  // }

  // // İsteğe bağlı: tüm ayarları listele
  // @UseGuards(JwtAuthGuard)
  // @Get()
  // async getAllSettings() {
  //   return await this.appSettingService.getAllSettings();
  // }
}
