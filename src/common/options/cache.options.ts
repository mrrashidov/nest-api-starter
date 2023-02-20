import {
  CacheModuleOptions,
  CacheOptionsFactory,
  CacheStore,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Injectable()
export class CacheOptions implements CacheOptionsFactory {
  constructor(private configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions {
    return {
      store: redisStore as unknown as CacheStore,
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      user: this.configService.get<string>('REDIS_USER'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      ttl: this.configService.get<number>('CACHE_TTL'),
      max: this.configService.get<number>('CACHE_CAPACITY'),
      isGlobal: false,
    };
  }
}
