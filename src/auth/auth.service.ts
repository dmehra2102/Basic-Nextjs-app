import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto';

@Injectable({})
export class AuthService {
  signin() {
    return { auth: true, message: 'User logged in successfully' };
  }

  signup(dto: AuthDto) {
    console.log(dto);
    return { auth: true, message: 'User signed in successfully' };
  }
}
