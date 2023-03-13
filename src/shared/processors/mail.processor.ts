import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MailService } from '@/shared/services/mail.service';

@Processor('email')
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailService: MailService) {}

  @Process('user-created')
  handleUserCreated(job: Job) {
    return this.runJob(job);
  }

  @Process('email-verification')
  handleEmailVerification(job: Job) {
    return this.runJob(job);
  }

  @Process('forgot-password')
  handleForgotPassword(job: Job) {
    return this.runJob(job);
  }

  @Process('reset-password')
  handleResetPassword(job: Job) {
    return this.runJob(job);
  }

  @Process('welcome')
  handleWelcome(job: Job) {
    return this.runJob(job);
  }

  protected runJob(job: any) {
    return this.mailService
      .send({ to: job.data.email, url: job.data.url, action: job.name })
      .then((res) =>
        this.logger.log({ action: '---', message: '--all-done--', data: res }),
      )
      .catch((err) => this.logger.error({ error: err, job }));
  }
}
