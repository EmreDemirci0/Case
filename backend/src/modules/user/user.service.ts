import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    // boş metot
  }

  async registerUser(email: string, password: string, full_name: string) {
    // boş metot
  }

  async findById(id: number) {
    // boş metot
  }
}
