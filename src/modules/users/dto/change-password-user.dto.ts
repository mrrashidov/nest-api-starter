import { Match } from '@/shared/decorators/match.decorator';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangePasswordUserDto {
  @IsString()
  @Length(6, 100)
  password: string;

  @IsNotEmpty()
  @Match('password_confirmation')
  password_confirmation: string;
}
