import bcrypt from 'bcrypt';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  signin() {
    return { auth: true, message: 'User logged in successfully' };
  }

  async signup(dto: AuthDto) {
    try {
      const hashPassword = await bcrypt.hash(
        dto.password,
        bcrypt.genSaltSync(10),
      );

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hashPassword,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
        omit: { hashPassword: true },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials already taken');
        }
      }
      throw error;
    }
  }
}
