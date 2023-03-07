import { Injectable, Logger } from '@nestjs/common';
import { ForgotPasswordAuthDto } from './dto/forgot-password-auth.dto';
import { ResetPasswordAuthDto } from './dto/reset-password-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { UnlockAuthDto } from './dto/unlock-auth.dto';

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name);
  signin(payload: SignInAuthDto) {
    return payload;
  }

  signup(payload: SignUpAuthDto) {
    return payload;
  }

  logout(user: string, token: string) {
    return { user, token };
  }

  refreshToken(user: string, token: string) {
    return { user, token };
  }

  lock(user: string) {
    return { user };
  }

  unlock(user: string, payload: UnlockAuthDto) {
    return { user, payload };
  }

  forgotPassword(payload: ForgotPasswordAuthDto) {
    return payload;
  }

  resetPassword(payload: ResetPasswordAuthDto) {
    return payload;
  }

  send(type: string, token: string) {
    return { type, token };
  }

  verify(type: string, token: string) {
    return { type, token };
  }
}
