import { Match } from '@/shared/decorators/match.decorator';
import { IsNotEmpty, IsString, Length, NotContains } from 'class-validator';

export class ResetPasswordAuthDto {
  @IsNotEmpty()
  @NotContains(' ')
  @Length(6, 100)
  token: string;

  @IsString()
  @Length(6, 100)
  password: string;

  @IsNotEmpty()
  @Match('password')
  password_confirmation: string;
}
