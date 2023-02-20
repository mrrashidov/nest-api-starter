import { Transform } from 'class-transformer';
import { IsInt, IsOptional, ValidateIf } from 'class-validator';

export class PaginationDto {
  @ValidateIf((o) => o.after)
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  first?: number = 10;

  @ValidateIf((o) => !o.before)
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  after?: number = 0;

  @ValidateIf((o) => o.before)
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  last?: number;

  @ValidateIf((o) => !o.after)
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  before?: number;
}
