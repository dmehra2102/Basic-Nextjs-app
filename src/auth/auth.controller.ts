import { AuthService } from './auth.service';
import { Controller, Post } from '@nestjs/common';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup() {
    return 'Hello Signup users';
  }

  @Post('signin')
  signin() {
    return 'Hello Signin users';
  }
}
