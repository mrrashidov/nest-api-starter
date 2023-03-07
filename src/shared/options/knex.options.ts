import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KnexModuleOptions, KnexModuleOptionsFactory } from 'nestjs-knex';

@Injectable()
export class KnexOptions implements KnexModuleOptionsFactory {
  constructor(private configService: ConfigService) {}

  createKnexModuleOptions(): KnexModuleOptions {
    return {
      config: {
        client: this.configService.get<string>('DB_CLIENT'),
        connection: {
          host: this.configService.get<string>('DB_HOST'),
          user: this.configService.get<string>('DB_USER'),
          password: this.configService.get<string>('DB_PASSWORD'),
          database: this.configService.get<string>('DB_NAME'),
          port: this.configService.get<number>('DB_PORT'),
        },
      },
    };
  }
}
