import { Throttle } from '@nestjs/throttler';
import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { ForgotPasswordAuthDto } from './dto/forgot-password-auth.dto';
import { ResetPasswordAuthDto } from './dto/reset-password-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import type { Request, Response } from 'express';
import { IsPublic } from '@/shared/decorators/is-public.decorator';
import { User } from '@/shared/decorators/user.decorator';

@Throttle(20, 60)
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('auth/signin')
  async signIn(@Body() payload: SignInAuthDto, @Res() res: Response) {
    const currentUser: any = await this.authService.signIn(payload);

    if (payload.rememberMe) {
      return res
        .cookie('rt', currentUser.refresh_token, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .status(200)
        .json({
          user: currentUser.user,
          access_token: currentUser.access_token,
        });
    } else {
      return res.status(200).json(currentUser);
    }
  }

  @IsPublic()
  @Post('auth/signup')
  signUp(@Body() payload: SignUpAuthDto) {
    return this.authService.signUp(payload);
  }

  @IsPublic()
  @Get('auth/verify/:token')
  verify(@Param('token') token: string) {
    return this.authService.verify(token);
  }

  @IsPublic()
  @Get('auth/verify/send')
  send(@Param('token') token: string) {
    return this.authService.send(token);
  }

  @IsPublic()
  @Post('auth/password/forgot')
  forgotPassword(@Body() payload: ForgotPasswordAuthDto) {
    return this.authService.forgotPassword(payload);
  }

  @IsPublic()
  @Post('auth/password/reset')
  resetPassword(@Body() payload: ResetPasswordAuthDto) {
    return this.authService.resetPassword(payload);
  }

  @Post('auth/logout')
  async logout(
    @Headers('authorization') token: string,
    @User() user: any,
  ): Promise<any> {
    return this.authService.logout(user, token);
  }

  @Post('auth/refresh-token')
  refreshToken(@User() user: any, @Req() request: Request) {
    return this.authService.refreshToken(user, request.cookies.rt);
  }
}
