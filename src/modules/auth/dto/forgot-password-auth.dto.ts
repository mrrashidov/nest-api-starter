import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class ForgotPasswordAuthDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}
