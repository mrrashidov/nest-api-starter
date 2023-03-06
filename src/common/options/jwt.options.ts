import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JWTOptions implements JwtOptionsFactory {
  constructor(private configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get('JWT_SECRET') || 'secret',
      signOptions: {
        expiresIn: this.configService.get('JWT_EXPIRES_IN') || '1h',
      },
    };
  }
}
