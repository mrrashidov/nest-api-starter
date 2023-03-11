import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailService } from '@/shared/services/mail.service';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'email',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, MailService],
})
export class UsersModule {}
