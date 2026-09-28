import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../domain/token-service';

@Injectable()
export class JwtTokenService extends TokenService {
  constructor(private readonly jwt: JwtService) {
    super();
  }

  sign(payload: Parameters<TokenService['sign']>[0]): Promise<string> {
    return this.jwt.signAsync({ ...payload });
  }
}
