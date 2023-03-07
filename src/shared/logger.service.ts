import { ConfigService } from '@nestjs/config';
import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class MyLogger implements LoggerService {
  constructor(private readonly config: ConfigService) {}
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    this.logMode({ message, ...optionalParams });
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    this.logMode({ message, ...optionalParams });
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    this.logMode({ message, ...optionalParams });
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {
    this.logMode({ message, ...optionalParams });
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {
    this.logMode({ message, ...optionalParams });
  }

  logMode(data) {
    this.config.get('NODE_ENV') === 'development'
      ? console.log(data)
      : 'database ga yozdirish kerak';
  }
}
