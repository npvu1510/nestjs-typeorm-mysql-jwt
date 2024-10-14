import { Body, Controller, Get, Post } from '@nestjs/common';

import { AuthService as AuthService } from './auth.service';
import { RegisterDto } from './dtos/register-user.dto';
import { ppid } from 'process';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return {
      status: 'success',
      data: {
        user,
      },
    };
  }
}
