import { IsNotEmpty, Length, NotContains } from 'class-validator';

export class UnlockAuthDto {
  @IsNotEmpty()
  @NotContains(' ')
  @Length(6, 100)
  password: string;
}
