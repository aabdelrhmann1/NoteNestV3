import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { LoginDto } from '../users/dto/login-user.dto.js';
import bcrypt from 'bcrypt';
import { SignUpDto } from '../users/dto/signup-user.dto.js';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto) {
    const user = this.userService.createUser(dto);
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByIdentifier(dto.identifier);
    const ok = user && (await bcrypt.compare(dto.password, user.password_hash));
    if (!user || !ok) throw new UnauthorizedException('Invalid credentials');
    const access_token = await this.jwtService.signAsync({ sub: user.id });
    return { token: access_token };
  }
}
