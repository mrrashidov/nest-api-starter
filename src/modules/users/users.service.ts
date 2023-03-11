import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import * as bcrypt from 'bcrypt';
import { ChangePasswordUserDto } from './dto/change-password-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { TwoFactorRecoveryUserDto } from './dto/two-factor-recovery-user.dto';
import { TwoFactorUserDto } from './dto/two-factor-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailService } from '@/shared/services/mail.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class UsersService {
  logger = new Logger(UsersService.name);

  constructor(
    @InjectKnex() private readonly knex: Knex,
    @InjectQueue('email') private readonly smsQueue: Queue,
    private readonly mailService: MailService,
  ) {}

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

  async create(payload: CreateUserDto) {
    const baseQuery = await this.find({ email: payload.email });
    if (baseQuery) {
      throw new ConflictException('This email already exists');
    }
    const genSalt = await bcrypt.genSalt();
    payload.password = await bcrypt.hash(payload.password, genSalt);

    return this.knex('users')
      .insert(payload)
      .returning('*')
      .then(async (res) => {
        this.logger.log('user-created');
        await this.smsQueue.add('user-created', res[0]);

        return res[0];
      })
      .catch((err) => {
        this.logger.error(err);
        return err;
      });
  }

  async findAll() {
    this.logger.log('user-list here');
    return this.knex('users');
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

  find(where: any): Promise<any> {
    return this.knex('users').where(where).first();
  }
}
