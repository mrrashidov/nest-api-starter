import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';
import { ThrottlerModule } from '@nestjs/throttler';
import { KnexOptions } from './options/knex.options';
import { ThrottleOptions } from './options/throttler.options';
import { JwtModule } from '@nestjs/jwt';
import { JWTOptions } from './options/jwt.options';
import { CacheOptions } from './options/cache.options';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useClass: JWTOptions,
    }),
    ThrottlerModule.forRootAsync({
      useClass: ThrottleOptions,
    }),
    KnexModule.forRootAsync({
      useClass: KnexOptions,
    }),
    CacheModule.registerAsync({
      useClass: CacheOptions,
    }),
  ],
})
export class CommonModule {}
