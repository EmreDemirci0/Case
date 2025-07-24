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
  async login(//frontend/authservice.ts içinde kullanılıyor
    @Body() body: { email: string; password: string }, @Res() res: Response,
  ): Promise<void> {

    const { email, password } = body;
    const user: ValidateUserResult = await this.userService.validateUser(email, password);
    if (user === 'notfound' || user === 'invalid') {
      res.status(401).json(new BaseResponse(null, false, 'Email veya parola yanlış'));
      return;
    } else if (typeof user === 'object' && user !== null && 'status' in user && user.status === 'valid') {
      const token = jwt.sign(
        { userId: user.id },//datas  // payload
        process.env.JWT_SECRET,// gizli anahtar (env'de sakla)
        { expiresIn: "1d" }// token geçerlilik süresi
      );

      res.status(200).json(new BaseResponse({ token }, true, 'Giriş başarılı'));
    } else {
      res.status(400).json(new BaseResponse({ errorType: 'unknown' }, false, 'Bilinmeyen hata'));
    }
  }

  @Post('register')
  async register(//frontend/authservice.ts içinde kullanılıyor
    @Body() body: { email: string; password: string; full_name: string },
    @Res() res: Response): Promise<void> {
    const { email, password, full_name } = body;
    const result = await this.userService.registerUser(email, password, full_name);
    if (result) {
      res.status(200).json(new BaseResponse(null, true, 'Kayıt başarılı'));
    } else {
      res.status(400).json(new BaseResponse(null, false, 'Kayıt başarısız, E-posta zaten kullanılıyor'));
    }
  }
  @UseGuards(JwtAuthGuard)
  @Post('user/logout')
  async logout(@Res() res: Response) {//frontend/authservice.ts içinde kullanılıyor
    // Opsiyonel olarak log tutabilirsin
    res.status(200).json(new BaseResponse(null, true, 'Çıkış başarılı'));
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('/energy')
  // async getEnergy(@Req() req) {
  //   try {
  //     const user = await this.userService.getUserById(req.user.userId);
  //     if (!user) {
  //       return new BaseResponse(null, false, 'Kullanıcı bulunamadı');
  //     }
  //     const energy = await this.userService.getCurrentEnergy(user);
  //     const lastEnergyUpdateAt = user.lastEnergyUpdateAt;
  //     return new BaseResponse({ energy, lastEnergyUpdateAt }, true, 'Enerji bilgisi başarıyla getirildi');
  //   } catch (error) {
  //     return new BaseResponse(null, false, 'Enerji bilgisi getirilirken hata oluştu');
  //   }
  // }
  // @UseGuards(JwtAuthGuard)
  // @Post('/energy/consume')
  // async consumeEnergy(@Req() req, @Body() body: { amount: number }) {
  //   const userId = req.user.userId;
  //   const amount = body.amount;

  //   const success = await this.userService.consumeEnergy(userId, amount);
  //   if (!success) {
  //     return new BaseResponse(null, false, 'Yeterli enerjiniz yok.');
  //   }

  //   return new BaseResponse(null, true, 'Enerji başarıyla harcandı.');
  // }



}
