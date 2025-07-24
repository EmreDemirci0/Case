
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
    const progressPerEnergy=await this.appSettingService.getSetting('progress_per_energy');
    return new BaseResponse({ maxEnergy, regenMinutes,maxItemLevel,progressPerEnergy }, true, "Ayarlar getirildi");
  }

}
