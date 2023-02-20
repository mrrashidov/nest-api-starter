import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';
import { ThrottlerModule } from '@nestjs/throttler';
import { KnexOptions } from './options/knex.options';
import { ThrottleOptions } from './options/throttler.options';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      useClass: ThrottleOptions,
    }),
    KnexModule.forRootAsync({
      useClass: KnexOptions,
    }),
  ],
})
export class CommonModule {}
