import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthJwtStrategy } from './strategy/jwt.strategy';
import { UsersService } from '@/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '@/shared/services/mail.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'email',
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthJwtStrategy,
    JwtService,
    UsersService,
    MailService,
  ],
})
export class AuthModule {}
