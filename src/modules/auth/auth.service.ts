import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { StatusType } from '~/global/enum.types';
import { UsersService } from '@/modules/users/users.service';
import { ForgotPasswordAuthDto } from './dto/forgot-password-auth.dto';
import { ResetPasswordAuthDto } from './dto/reset-password-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { UnlockAuthDto } from './dto/unlock-auth.dto';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name);

  constructor(
    @InjectQueue('email') private readonly smsQueue: Queue,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(payload: SignInAuthDto) {
    const hasAccount: any = await this.userService.find({
      email: payload.email,
    });
    if (!hasAccount) throw new UnauthorizedException('Wrong email or password');
    const matchPassword = await bcrypt.compare(
      payload.password,
      hasAccount.password,
    );

    if (!matchPassword)
      throw new UnauthorizedException('Wrong email or password');
    if (hasAccount.status === StatusType.PENDING)
      throw new ForbiddenException(
        'Your account not active please active your account',
      );
    if (hasAccount.status === StatusType.BLOCK)
      throw new ForbiddenException('Your account blocked');
    if (hasAccount.status === StatusType.DELETED)
      throw new ForbiddenException('Your account deleted');
    const user = {
      id: hasAccount.id,
      username: hasAccount?.username,
      full_name: `${hasAccount.first_name} ${hasAccount.last_name}`,
      avatar: hasAccount.avatar,
      role: {
        id: 'role-id-here',
        name: 'role-name-here',
        scopes: ['scopes-here'],
      },
    };
    const access_token = this.tokenGenerator({
      sub: hasAccount.id,
      issuer: 'front-app-url',
      role: {
        id: 'role-id',
        scopes: ['scopes-here'],
      },
    });

    if (payload.rememberMe) {
      const refresh_token = this.tokenGenerator(
        {
          sub: hasAccount.id,
          issuer: 'front-app-url',
        },
        true,
      );
      return {
        user,
        access_token,
        refresh_token,
      };
    } else {
      return {
        user,
        access_token,
      };
    }
  }

  signUp(payload: SignUpAuthDto) {
    return this.userService.create(payload);
  }

  logout(user: string, token: string) {
    return { user, token };
  }

  refreshToken(user: any, token: string) {
    if (!token || !user) {
      throw new UnauthorizedException();
    }
    const verifyToken = this.jwtService.verify(token, {
      secret:
        this.configService.get('JWT_SECRET') ||
        '279e6748cb67c36691c8bed072239880',
    });
    if (!verifyToken || user.id !== verifyToken.sub) {
      throw new UnauthorizedException();
    }
    const access_token = this.tokenGenerator({
      sub: user.id,
      issuer: 'front-app-url',
      role: {
        id: user.role.id,
        scopes: user.role.scopes,
      },
    });
    return { access_token };
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

  protected tokenGenerator(payload: any, refreshable = false) {
    const options = refreshable
      ? {
          secret:
            this.configService.get('JWT_SECRET') ||
            '279e6748cb67c36691c8bed072239880',
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '1w',
        }
      : {
          secret:
            this.configService.get('JWT_SECRET') ||
            '279e6748cb67c36691c8bed072239880',
          expiresIn: this.configService.get('JWT_EXPIRES_IN') || '1h',
        };
    return this.jwtService.sign(payload, options);
  }
}
