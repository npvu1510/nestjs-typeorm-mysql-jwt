import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { envs } from 'src/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envs.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    console.log(payload);

    const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
