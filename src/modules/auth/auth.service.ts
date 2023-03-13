import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectKnex, Knex } from 'nestjs-knex';

import { UsersService } from '@/modules/users/users.service';
import { StatusType } from '~/global/enum.types';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { ForgotPasswordAuthDto } from './dto/forgot-password-auth.dto';
import { ResetPasswordAuthDto } from './dto/reset-password-auth.dto';
import { setTimezone } from '@/shared/utils/setTimezone';

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name);

  constructor(
    @InjectQueue('email') private readonly queue: Queue,
    @InjectKnex() private readonly knex: Knex,
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

  async forgotPassword({ email, phone }: ForgotPasswordAuthDto) {
    const { randomBytes } = await import('crypto');

    const hasAccount: any = await this.userService.find(
      email ? { email } : { phone },
    );
    if (!hasAccount) throw new NotFoundException('Account not found');

    const token = randomBytes(16).toString('hex');

    const expires_at = new Date(
      Date.now() +
        parseInt(
          this.configService.get('RESET_PASSWORD_CODE_LIFETIME') || '20',
        ) *
          60000,
    );
    const baseQuery = this.knex('password_resets').where({
      status: 'pending',
      user_id: hasAccount.id,
    });
    const hasToken = await baseQuery.clone().first();

    if (hasToken) {
      if (hasToken.expires_at <= new Date()) {
        await baseQuery.clone().update({
          status: 'rejected',
        });
      }

      return { message: 'Email already send' };
    } else {
      await this.knex('password_resets')
        .insert({
          user_id: hasAccount.id,
          password: hasAccount.password,
          token,
          expires_at,
        })
        .returning('*');
      return this.queue
        .add('forgot-password', {
          email,
          url: `${this.configService.get('FRONT_APP_URL')}?token=${token}`,
        })
        .then(() => ({ message: 'Email sent' }));
    }
  }

  async resetPassword(payload: ResetPasswordAuthDto) {
    const qb = this.knex('password_resets').where({
      token: payload.token,
      status: 'pending',
    });
    const hasItem = await qb.first();
    if (hasItem && setTimezone(hasItem.expires_at) >= setTimezone(new Date())) {
      const newPassword = await bcrypt.hash(payload.password, 10);
      // TODO: agar oldindan qollanilgan password bor bolsa uni control qilish kerak
      const userQb = this.knex('users').where({ id: hasItem.user_id });
      const result = await Promise.all([
        qb.clone().update({ status: 'accepted' }),
        userQb.clone().update({ password: newPassword }),
        userQb.clone().first(),
      ]);
      if (result.length >= 1) {
        await this.queue.add('reset-password', { email: result[2].email });
      }
      return { message: 'Password successfully changed' };
    } else {
      await qb.clone().update({ status: 'rejected' });
      console.log(qb.clone().update({ status: 'rejected' }).toQuery());

      throw new UnprocessableEntityException('Bad token or Token expired');
    }
  }

  send(token: string) {
    return { token };
  }

  verify(token: string) {
    return { token };
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
