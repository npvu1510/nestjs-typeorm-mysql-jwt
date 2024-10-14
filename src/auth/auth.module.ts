import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
