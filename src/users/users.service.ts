import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signup-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-user.dto.js';
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: SignUpDto) {
    const { password, ...rest } = data;
    return this.prisma.users.create({
      data: {
        ...rest,
        email: rest.email.toLowerCase(),
        birthday: new Date(rest.birthday),
        password_hash: await bcrypt.hash(password, 10),
      },
      omit: { password_hash: true },
    });
  }

  async findByIdentifier(identifier: string) {
    const id = identifier.trim().toLowerCase();
    try {
      const user = await this.prisma.users.findUnique({
        where: id.includes('@') ? { email: id } : { username: id },
      });
      return user;
    } catch (error) {
      console.log(`Error in usersService login: ${error}`);
    }
  }
}
