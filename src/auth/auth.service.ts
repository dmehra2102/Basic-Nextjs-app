import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signin() {
    return { auth: true, message: 'User logged in successfully' };
  }

  signup() {
    return { auth: true, message: 'User signed in successfully' };
  }
}
