import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  NotContains,
} from 'class-validator';

export class SignUpAuthDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 25)
  first_name: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 25)
  last_name: string;

  @IsNotEmpty()
  @NotContains(' ')
  @Length(6, 100)
  password: string;
}
