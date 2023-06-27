import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { event } from '../../common/assets';
import { ForgotPasswordEvent, UserRegisterEvent } from '../../common/types';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class AuthEvent {
  constructor(private readonly mailService: MailService) {}

  @OnEvent(event.USER_REGISTER, { async: true })
  async handleSentEmailVerification(payload: UserRegisterEvent) {
    const res = await this.mailService.sendVerificationEmailToUser(
      payload.email,
      payload.otp
    );

    console.info('Email response: ', res);
  }

  @OnEvent(event.FORGOT_PASSWORD)
  async handleForgotPasswordEvent(payload: ForgotPasswordEvent) {
    const res = await this.mailService.sendForgotPasswordEmail(
      payload.email,
      payload.otp
    );

    console.info('Email response: ', res);
  }
}
