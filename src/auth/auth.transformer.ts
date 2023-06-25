import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthTransformer {
  transformUser(user: any, access_token: string) {
    delete user.password;

    return {
      user,
      access_token,
    };
  }
}
