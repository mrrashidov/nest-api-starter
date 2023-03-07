import { Throttle } from '@nestjs/throttler';
import {
  Controller,
  Headers,
  Get,
  Post,
  Body,
  Param,
  Res,
  Req,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { ForgotPasswordAuthDto } from './dto/forgot-password-auth.dto';
import { ResetPasswordAuthDto } from './dto/reset-password-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import type { Response, Request } from 'express';
import { UnlockAuthDto } from './dto/unlock-auth.dto';
import { IsPublic } from '../../shared/decorators/is-public.decorator';
import { User } from '../../shared/decorators/user.decorator';

@Throttle(20, 60)
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('auth/signin')
  async signin(@Body() payload: SignInAuthDto, @Res() res: Response) {
    const currentUser: any = await this.authService.signin(payload);
    if (payload.rememberMe) {
      res
        .cookie('rt', currentUser.refresh_token, {
          path: '/api/v1/auth/refresh-token',
          httpOnly: true,
          secure: true,
        })
        .send(currentUser.result);
    } else {
      return res.send(currentUser);
    }
  }

  @IsPublic()
  @Post('auth/signup')
  signup(@Body() payload: SignUpAuthDto) {
    return this.authService.signup(payload);
  }

  @IsPublic()
  @Get('auth/verify/:type/confirm/:token')
  verify(@Param('token') token: string, @Param('type') type: string) {
    return this.authService.verify(type, token);
  }

  @IsPublic()
  @Get('auth/verify/:type/send')
  send(@Param('token') token: string, @Param('type') type: string) {
    return this.authService.send(type, token);
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

  @Get('auth/lock')
  lock(@User() user: any) {
    return this.authService.lock(user);
  }

  @Post('auth/unlock')
  unlock(@User() user: any, @Body() payload: UnlockAuthDto) {
    return this.authService.unlock(user, payload);
  }

  @Post('auth/refresh-token')
  refreshToken(@User() user: any, @Req() { cookies }: Request) {
    return this.authService.refreshToken(user, cookies.rt);
  }
}
