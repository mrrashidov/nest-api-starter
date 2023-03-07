import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    const getRequest = context.switchToHttp().getRequest();
    const userAgent = getRequest.headers['user-agent'];

    if (!userAgent) {
      throw new UnauthorizedException('Siz botmisiz ? :D');
    }

    if (
      !['/v1/callback', '/v1/sms/send', '/v1/sms/status'].includes(
        getRequest.url,
      )
    ) {
      throw new UnauthorizedException('Header must be x-access-type');
    }

    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
