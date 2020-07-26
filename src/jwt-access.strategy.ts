import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-jwt';
import { JWT_STRATEGY_OPTIONS } from './jwt-access.constants';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(JWT_STRATEGY_OPTIONS)
    private readonly jwtStrategyOptions: StrategyOptions,
  ) {
    super(jwtStrategyOptions);
  }

  //сюда попадает только если токен валидный
  validate(data: Record<string, unknown>): any {
    return data;
  }
}
