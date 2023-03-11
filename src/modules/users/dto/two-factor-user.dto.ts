import { IsString } from 'class-validator';

export class TwoFactorUserDto {
  @IsString()
  answer: string;
  @IsString()
  question_id: string;
}
