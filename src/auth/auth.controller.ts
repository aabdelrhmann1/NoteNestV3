import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from '../users/dto/signup-user.dto.js';
import { LoginDto } from '../users/dto/login-user.dto.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async createUser(@Body() data: SignUpDto) {
    return this.authService.signUp(data);
  }

  @Post('login')
  async loginUser(@Body() data: LoginDto) {
    return this.authService.login(data);
  }
}
