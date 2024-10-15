import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { IsNull, Not, Repository } from 'typeorm';
import { RegisterDto } from './dtos/register.dto';
import { JwtService } from '@nestjs/jwt';
import { envs } from 'src/config';
import { hashString } from 'src/utils/hash';
import { LoginDto } from './dtos/login.dto';

import * as bcrypt from 'bcrypt';
import { omit } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async generateTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId, email },
        { secret: envs.JWT_ACCESS_SECRET, expiresIn: 5 },
      ),
      this.jwtService.signAsync(
        { userId, email },
        { secret: envs.JWT_REFRESH_SECRET, expiresIn: '7d' },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async updateHashedRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await hashString(refreshToken);

    const res = await this.authRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
    console.log(res);
    return hashedRefreshToken;
  }

  async register(registerDto: RegisterDto) {
    const {
      firstName: first_name,
      lastName: last_name,
      password,
    } = registerDto;

    const hashedPassword = await hashString(password);
    const newUserEntity = this.authRepository.create({
      ...registerDto,
      first_name,
      last_name,
      password: hashedPassword,
    });

    const newUser = await this.authRepository.save(newUserEntity);

    // tokens
    const { accessToken, refreshToken } = await this.generateTokens(
      newUser.id,
      newUser.email,
    );
    const hashedRefreshToken = await this.updateHashedRefreshToken(
      newUser.id,
      refreshToken,
    );

    return {
      user: omit(newUser, [
        'password',
        'refreshToken',
        'created_at',
        'updated_at',
      ]),

      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const foundUser = await this.authRepository.findOne({
      where: { email },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        dateOfBirth: true,
        password: true,
      },
    });

    if (!foundUser || !(await bcrypt.compare(password, foundUser.password)))
      throw new HttpException(
        'Email or password is incorrect',
        HttpStatus.UNAUTHORIZED,
      );

    const { accessToken, refreshToken } = await this.generateTokens(
      foundUser.id,
      foundUser.email,
    );
    const hashedRefreshToken = this.updateHashedRefreshToken(
      foundUser.id,
      refreshToken,
    );

    return {
      user: omit(foundUser, 'password'),
      tokens: { accessToken, refreshToken },
    };
  }

  async logout(userId: string) {
    const res = await this.authRepository.update(
      { id: userId, refreshToken: Not(IsNull()) },
      { refreshToken: null },
    );
    console.log(res);
    return res;
  }
}
