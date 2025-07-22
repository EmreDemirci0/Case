import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AppSettingService } from '../app-setting/app-setting.service';

export type ValidateUserResult = 'notfound' | 'invalid' | { id: number; status: 'valid' };

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly appSettingService: AppSettingService, 
  ) {}

  // Kullanıcıyı email ve şifreyle doğrulama
  async validateUser(email: string, password: string): Promise<ValidateUserResult> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return 'notfound';

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return 'invalid';

    return { id: user.id, status: 'valid' };
  }

  // Kayıt işlemi
  async registerUser(email: string, password: string, full_name: string): Promise<boolean> {
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) return false;

    const hashed = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      email,
      password: hashed,
      full_name,
      lastEnergyUpdateAt: new Date(), // enerji başlangıcı
    });

    await this.userRepository.save(newUser);
    return true;
  }

  // Belirli bir kullanıcıyı getir
  async getUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    return user;
  }
  

  // Şu anki enerjiyi hesapla
  async getCurrentEnergy(user: User): Promise<number> {
    const maxEnergyStr = await this.appSettingService.getSetting('max_energy');
    const regenMinutesStr = await this.appSettingService.getSetting('energy_regen_minutes');
    
    const maxEnergy = maxEnergyStr ? parseFloat(maxEnergyStr) : 20;
    const regenMinutes = regenMinutesStr ? parseFloat(regenMinutesStr) : 5;
    

    const now = new Date();
    const lastUpdate = user.lastEnergyUpdateAt || now;
    
    const diffMs = now.getTime() - lastUpdate.getTime();
    const regenerated = Math.floor(diffMs / (regenMinutes * 60 * 1000));

    return Math.min(maxEnergy, regenerated);
  }

  async consumeEnergy(userId: number, amount: number): Promise<boolean> {
    const user = await this.getUserById(userId);
    const currentEnergy = await this.getCurrentEnergy(user);
   
    if (currentEnergy < amount) return false;

    const now = new Date();
    const maxEnergyStr = await this.appSettingService.getSetting('max_energy');
    const regenMinutesStr = await this.appSettingService.getSetting('energy_regen_minutes');
    console.log("regMin"+regenMinutesStr);
    const maxEnergy = maxEnergyStr ? parseFloat(maxEnergyStr) : 20;
    const regenMinutes = regenMinutesStr ? parseFloat(regenMinutesStr) : 5;

    // Şu anki enerjiden harcanan kadar çıkarınca, geriye kalan enerji kadar süreyi lastEnergyUpdateAt'ı geriye çekiyoruz.
    // Böylece enerji yenilenme süresi buna göre devam eder.
    console.log("currentEnergy"+currentEnergy);
    console.log("amount"+amount);
    console.log("regenMinutes"+regenMinutes);
    const msToSubtract = (currentEnergy - amount) * regenMinutes * 60 * 1000;
    const newLastUpdate = new Date(now.getTime() - msToSubtract);
    console.log(msToSubtract);
    console.log(newLastUpdate);


    await this.userRepository.update(userId, { lastEnergyUpdateAt: newLastUpdate });
    return true;
  }

  // Enerji sorgulama (controller için)
  // async getUserEnergy(userId: number): Promise<number> {
  //   const user = await this.getUserById(userId);
  //   return await this.getCurrentEnergy(user);
  // }
}
