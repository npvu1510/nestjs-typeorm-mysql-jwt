import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService as AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { ITokenPayload } from '../common/interfaces/token-payload.interface';
import { GetTokenPayload } from 'src/common/decorators/get-token-payload';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    return {
      status: 'success',
      data: await this.authService.register(registerDto),
    };
  }

  @Post('/login')
  async login(
    @Body()
    loginDto: LoginDto,
  ) {
    return {
      status: 'success',
      data: await this.authService.login(loginDto),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/logout')
  async logout(@GetTokenPayload() payload: ITokenPayload) {
    const { userId } = payload;
    return this.authService.logout(userId);
  }
}
