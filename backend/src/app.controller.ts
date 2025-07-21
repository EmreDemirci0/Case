import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './modules/user/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('hello') // http://localhost:3000/hello
  async getHello(): Promise<User[]> {
    return this.appService.getHello();
  }
}
