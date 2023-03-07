import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

export const User = createParamDecorator(
  (field: string, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    let user = req.user;

    if (!user) {
      throw new NotFoundException('User Not Found!');
    }

    try {
      if (field) {
        const fields = field.split('.');

        fields.forEach((e) => {
          user = user[e];
        });
      }

      return user;
    } catch (e) {
      throw new BaseExceptionFilter();
    }
  },
);
