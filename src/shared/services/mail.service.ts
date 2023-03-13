import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  /**
   *
   * @param to - list of receivers
   * @param url - Url line
   * @param action - Action line
   * @example
   *       to: 'bar@example.com, baz@example.com',
   *       action: 'email-verification',
   */
  async send({
    to,
    url,
    action,
  }: {
    to: string;
    url?: string;
    action: string;
  }) {
    const transporter = await createTransport({
      host: this.configService.get('MAIL_HOST') || 'smtp.kibera.uz',
      port: this.configService.get('MAIL_PORT') || 587,
      secure: this.configService.get('MAIL_ENCRYPTION') || false, // true for 465, false for other ports
      auth: {
        user: this.configService.get('MAIL_USERNAME'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
    return transporter.sendMail(this.templates(action, { to, url }));
  }

  /**
   * @param action - string
   * @param to - string
   * @param url - string
   * @private
   */
  private templates(action: string, { to, url }: { to: string; url?: string }) {
    switch (action) {
      case 'user-created':
        return {
          from: `${this.configService.get(
            'MAIL_FROM_NAME',
          )} <${this.configService.get('MAIL_FROM_ADDRESS')}>`,
          to,
          subject: 'Kibera account',
          html: '<b>Email verification message here</b>',
        };
      case 'email-verification':
        return {
          from: `${this.configService.get(
            'MAIL_FROM_NAME',
          )} <${this.configService.get('MAIL_FROM_ADDRESS')}>`,
          to,
          subject: 'Kibera account',
          html: '<b>Email verification message here</b>',
        };
      case 'forgot-password':
        return {
          from: `${this.configService.get(
            'MAIL_FROM_NAME',
          )} <${this.configService.get('MAIL_FROM_ADDRESS')}>`,
          to,
          subject: 'Kibera account security info',
          html:
            '<h1>Forgot password message here</h1><a href="' +
            url +
            '">Reset Password</a>',
        };
      case 'reset-password':
        return {
          from: `${this.configService.get(
            'MAIL_FROM_NAME',
          )} <${this.configService.get('MAIL_FROM_ADDRESS')}>`,
          to,
          subject: 'Kibera account security info',
          html: '<b>Reset password message here</b>',
        };
      case 'welcome':
        return {
          from: `${this.configService.get(
            'MAIL_FROM_NAME',
          )} <${this.configService.get('MAIL_FROM_ADDRESS')}>`,
          to,
          subject: 'Kibera account',
          html: '<b>Welcome message here</b>',
        };
    }
  }
}
