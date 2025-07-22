
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppSetting } from './app-setting.entity';

@Injectable()
export class AppSettingService {
  constructor(
    @InjectRepository(AppSetting)
    private readonly appSettingRepository: Repository<AppSetting>,
  ) {}

  // Tek bir ayarı getir
  async getSetting(key: string): Promise<string | null> {
    const setting = await this.appSettingRepository.findOne({ where: { key } });
    return setting?.value || null;
  }

  // Ayar ekle veya güncelle
  async upsertSetting(key: string, value: string): Promise<AppSetting> {
    let setting = await this.appSettingRepository.findOne({ where: { key } });
    if (setting) {
      setting.value = value;
    } else {
      setting = this.appSettingRepository.create({ key, value });
    }
    return this.appSettingRepository.save(setting);
  }

  // Tüm ayarları listele (isteğe bağlı)
  async getAllSettings(): Promise<AppSetting[]> {
    return this.appSettingRepository.find();
  }
}
