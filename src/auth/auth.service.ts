import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { Repository } from 'typeorm';
import { RegisterDto } from './dtos/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import { envs } from 'src/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId, email },
        { secret: envs.JWT_ACCESS_SECRET, expiresIn: envs.JWT_ACCESS_SECRET },
      ),
      this.jwtService.signAsync(
        { userId, email },
        { secret: envs.JWT_REFRESH_SECRET, expiresIn: envs.JWT_REFRESH_SECRET },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async register(registerDto: RegisterDto) {
    const { firstName: first_name, lastName: last_name } = registerDto;

    const newUser = this.authRepository.create({
      ...registerDto,
      first_name,
      last_name,
    });

    const { accessToken, refreshToken } = await this.getTokens(
      newUser.id,
      newUser.email,
    );

    console.log(accessToken);
    console.log(refreshToken);

    return this.authRepository.save(newUser);
  }
}
