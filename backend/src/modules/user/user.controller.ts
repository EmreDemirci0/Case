import { Controller, Body, Post, Res, UseGuards, Req, Get } from '@nestjs/common';
import { UserService, ValidateUserResult } from './user.service';
import { BaseResponse } from '../../_base/base.response';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {
  }
  @Post('login')
  async login(
    @Body() body: { email: string; password: string }, @Res() res: Response,
  ): Promise<void> {

    const { email, password } = body;
    const user: ValidateUserResult = await this.userService.validateUser(email, password);
    if (user === 'notfound') {
      res.status(404).json(new BaseResponse({ errorType: 'email' }, false, 'Kayıtlı E-posta bulunamadı'));
    } else if (user === 'invalid') {
      res.status(401).json(new BaseResponse({ errorType: 'password' }, false, 'Şifre yanlış'));
    } else if (typeof user === 'object' && user !== null && 'status' in user && user.status === 'valid') {
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json(new BaseResponse({ token }, true, 'Giriş başarılı'));
    } else {
      res.status(400).json(new BaseResponse({ errorType: 'unknown' }, false, 'Bilinmeyen hata'));
    }
  }

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; full_name: string },
    @Res() res: Response,
  ): Promise<void> {
    const { email, password, full_name } = body;
    const result = await this.userService.registerUser(email, password, full_name);

    if (result === 'invalid_password') {
      res.status(400).json(new BaseResponse({ result }, false, 'Parola kurallarını sağlamıyor'));
      return;
    }

    if (result === 'email_exists') {
      res.status(400).json(new BaseResponse({ result }, false, 'E-posta zaten kayıtlı'));
      return;
    }

    if (typeof result === 'object' && result.status === 'success') {
      res.status(200).json(new BaseResponse(null, true, 'Kayıt başarılı'));
      return;
    }

    res.status(500).json(new BaseResponse(null, false, 'Bilinmeyen hata'));
  }

  @UseGuards(JwtAuthGuard)
  @Post('user/logout')
  async logout(@Res() res: Response) {
    res.status(200).json(new BaseResponse(null, true, 'Çıkış başarılı'));
  }
}
