import bcrypt from 'bcrypt';
import { AuthDto, LoginDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signin(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Incorrect Credentials!');
    }

    const isCorrectPassword = await bcrypt.compare(
      dto.password,
      user.hashPassword,
    );

    if (!isCorrectPassword) {
      throw new ForbiddenException('Incorrect Credentials!');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashPassword, ...result } = user;
    return result;
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
