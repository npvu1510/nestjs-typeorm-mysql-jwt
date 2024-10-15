import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { envs } from 'src/config';
import { ITokenPayload } from '../../common/interfaces/token-payload.interface';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: ITokenPayload) {
    return payload;
  }
}
