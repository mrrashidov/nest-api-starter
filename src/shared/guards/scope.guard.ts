import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ScopeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const needleScope = this.reflector.get<string[]>(
      'scope',
      context.getHandler(),
    );
    if (!needleScope) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userScopes: string[] = request.user?.role?.scopes;

    if (!userScopes) throw new ForbiddenException();
    return matchScopes(needleScope, userScopes);
  }
}

function matchScopes(
  needleScopes: string | string[],
  userScopes: string[],
): boolean {
  return typeof needleScopes === 'string'
    ? userScopes.includes(needleScopes)
    : needleScopes.some((needleScope) => userScopes.includes(needleScope));
}
