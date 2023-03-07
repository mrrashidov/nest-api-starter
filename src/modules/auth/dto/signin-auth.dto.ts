import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  NotContains,
} from 'class-validator';

export class SignInAuthDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  username: string;

  @IsBoolean()
  rememberMe: boolean;

  @IsNotEmpty()
  @NotContains(' ')
  @Length(6, 100)
  password: string;
}
