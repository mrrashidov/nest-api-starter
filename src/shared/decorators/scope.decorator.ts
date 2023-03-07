import { SetMetadata } from '@nestjs/common';

export const Scope = (args: string | string[]) => SetMetadata('scope', args);
