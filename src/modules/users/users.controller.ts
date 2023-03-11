import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TwoFactorUserDto } from './dto/two-factor-user.dto';
import { TwoFactorRecoveryUserDto } from './dto/two-factor-recovery-user.dto';
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { IsPublic } from '@/shared/decorators/is-public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('two-factor-authentication')
  twoFactor(@Body() payload: TwoFactorUserDto) {
    return this.usersService.twoFactor(payload);
  }

  @Post('two-factor-authentication/:code/confirm')
  twoFactorConfirm(@Param('code') code: string) {
    return this.usersService.twoFactorConfirm(code);
  }

  @Post('two-factor-recovery-codes')
  twoFactorRecovery(@Body() payload: TwoFactorRecoveryUserDto) {
    return this.usersService.twoFactorRecovery(payload);
  }

  @Post('change-password')
  changePassword(payload: ChangePasswordUserDto) {
    return this.usersService.changePassword(payload);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @IsPublic()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
