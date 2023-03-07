import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'IsPublic';
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
