import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';

@Controller('user')
export class UserController {
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
