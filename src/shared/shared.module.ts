import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { KnexOptions } from './options/knex.options';
import { ThrottleOptions } from './options/throttler.options';
import { JwtModule } from '@nestjs/jwt';
import { JWTOptions } from './options/jwt.options';
import { CacheOptions } from './options/cache.options';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/auth.guard';
import { ScopeGuard } from './guards/scope.guard';
import { BullModule } from '@nestjs/bull';
import { BullSharedOptions } from '@/shared/options/bull-shared.options';
import { MailProcessor } from '@/shared/processors/mail.processor';
import { MailService } from '@/shared/services/mail.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useClass: JWTOptions,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ThrottlerModule.forRootAsync({
      useClass: ThrottleOptions,
    }),
    BullModule.forRootAsync({
      useClass: BullSharedOptions,
    }),
    KnexModule.forRootAsync({
      useClass: KnexOptions,
    }),
    CacheModule.registerAsync({
      useClass: CacheOptions,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ScopeGuard,
    },
    MailProcessor,
    MailService,
  ],
})
export class SharedModule {}
