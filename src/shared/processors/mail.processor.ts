import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MailService } from '@/shared/services/mail.service';

@Processor('email')
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailService: MailService) {}

  @Process('user-created')
  handleTranscode(job: Job) {
    return this.mailService
      .send({ to: job.data.email, action: job.name })
      .then((res) =>
        this.logger.log({ action: '---', message: '--all-done--', data: res }),
      )
      .catch((err) => this.logger.error({ error: err, job }));
  }
}
