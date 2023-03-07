import { Injectable, Logger } from '@nestjs/common';
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { TwoFactorRecoveryUserDto } from './dto/two-factor-recovery-user.dto';
import { TwoFactorUserDto } from './dto/two-factor-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  logger = new Logger(UsersService.name);

  twoFactor(payload: TwoFactorUserDto) {
    return payload;
  }

  twoFactorConfirm(code: string) {
    return code;
  }

  twoFactorRecovery(payload: TwoFactorRecoveryUserDto) {
    return payload;
  }

  changePassword(payload: ChangePasswordUserDto) {
    return payload;
  }

  create(createUserDto: CreateUserDto) {
    return createUserDto;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return id;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return { id, updateUserDto };
  }

  remove(id: number) {
    return id;
  }
}
