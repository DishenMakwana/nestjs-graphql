import 'dotenv/config';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logo: string;
  private readonly supportEmail: string;
  private readonly adminEmail: string;

  constructor(
    private readonly mailService: MailerService,
    private readonly configService: ConfigService
  ) {
    this.logo = `${this.configService.getOrThrow<string>(
      'API_BASE_URL'
    )}/assets/logo.png`;

    this.supportEmail = this.configService.getOrThrow<string>('SUPPORT_EMAIL');

    this.adminEmail = this.configService.getOrThrow<string>('ADMIN_EMAIL');
  }

  async sendForgotPasswordEmail(email: string, otp: string) {
    return this.mailService.sendMail({
      to: email,
      subject: 'NestJS | Forgot Password Request',
      template: './forgot_password',
      context: {
        name: email.toLowerCase(),
        otp,
        logo: this.logo,
        supportEmail: this.supportEmail,
      },
    });
  }

  async sendVerificationEmailToUser(email: string, otp: string) {
    return this.mailService.sendMail({
      to: email,
      subject: 'NestJS | Account Verification',
      template: './register_user',
      context: {
        name: email.toLowerCase(),
        otp,
        logo: this.logo,
        supportEmail: this.supportEmail,
      },
    });
  }
}
