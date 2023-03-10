import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  NotContains,
} from 'class-validator';

export class SignInAuthDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean = false;

  @IsNotEmpty()
  @NotContains(' ')
  @Length(6, 100)
  password: string;
}
