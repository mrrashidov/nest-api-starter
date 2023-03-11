import { IsString } from 'class-validator';

export class TwoFactorRecoveryUserDto {
  @IsString()
  answer: string;
  @IsString()
  question_id: string;
}
