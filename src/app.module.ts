import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [AuthModule, SharedModule, UsersModule],
})
export class AppModule {}
