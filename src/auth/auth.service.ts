import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthDto, LoginDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

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

    return this.signToken(user.id, user.email);
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

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      id: userId,
      email,
    };

    const secret = this.config.get<string>('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });
    return {
      access_token: token,
    };
  }
}
