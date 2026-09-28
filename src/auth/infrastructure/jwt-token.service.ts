import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InvalidTokenError } from '../domain/invalid-token.error';
import { JwtPayload } from '../domain/jwt-payload';
import { TokenService } from '../domain/token-service';

@Injectable()
export class JwtTokenService extends TokenService {
  constructor(private readonly jwt: JwtService) {
    super();
  }

  sign(payload: JwtPayload): Promise<string> {
    return this.jwt.signAsync({ ...payload });
  }

  async verify(token: string): Promise<JwtPayload> {
    try {
      const { sub, role, rut } = await this.jwt.verifyAsync<JwtPayload>(token);
      return { sub, role, ...(rut && { rut }) };
    } catch {
      throw new InvalidTokenError();
    }
  }
}
