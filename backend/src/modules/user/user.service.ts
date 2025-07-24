import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AppSettingService } from '../app-setting/app-setting.service';
import { Item } from "../item/item.entity";
import { ItemInstance } from '../item-instance/item-instance.entity';

export type ValidateUserResult = 'notfound' | 'invalid' | { id: number; status: 'valid' };
export type RegisterUserResult = 
  | 'invalid_password'
  | 'email_exists'
  | { status: 'success'; userId: number };

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly appSettingService: AppSettingService,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,

    @InjectRepository(ItemInstance)
    private readonly itemInstanceRepository: Repository<ItemInstance>,
  ) { }

  // Kullanıcıyı email ve şifreyle doğrulama
  async validateUser(email: string, password: string): Promise<ValidateUserResult> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return 'notfound';

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return 'invalid';

    return { id: user.id, status: 'valid' };
  }

 async registerUser(email: string, password: string, full_name: string): Promise<RegisterUserResult> {
  if (!this.isPasswordValid(password)) {
    return 'invalid_password';
  }

  const existing = await this.userRepository.findOne({ where: { email } });
  if (existing) {
    return 'email_exists';
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = this.userRepository.create({
    email,
    password: hashed,
    full_name,
    lastEnergyUpdateAt: new Date(),
  });

  const savedUser = await this.userRepository.save(newUser);

  const items = await this.itemRepository.findByIds([1, 2, 3, 4, 5, 6, 7, 8]);

  const instances = items.map((item) =>
    this.itemInstanceRepository.create({
      user: savedUser,
      item,
      currentLevel: 1,
    }),
  );

  await this.itemInstanceRepository.save(instances);

  return { status: 'success', userId: savedUser.id };
}


  isPasswordValid(password: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{5,15}$/;
    return regex.test(password);
  }

  async getUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    return user;
  }

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

    const regenMinutes = regenMinutesStr ? parseFloat(regenMinutesStr) : 5;

    const regenMs = regenMinutes * 60 * 1000;
    const lastUpdate = user.lastEnergyUpdateAt || now;
    const elapsed = now.getTime() - lastUpdate.getTime();

    const remainder = elapsed % regenMs;

    const newEnergy = currentEnergy - amount;
    const newElapsed = newEnergy * regenMs + remainder;
    const newLastUpdate = new Date(now.getTime() - newElapsed);

    await this.userRepository.update(userId, { lastEnergyUpdateAt: newLastUpdate });
    return true;
  }
}
