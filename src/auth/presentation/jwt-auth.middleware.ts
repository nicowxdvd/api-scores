import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import type { NextFunction, Response } from 'express';
import { InvalidTokenError } from '../domain/invalid-token.error';
import { TokenService } from '../domain/token-service';
import { AuthenticatedRequest } from './authenticated-request';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private readonly tokens: TokenService) {}

  async use(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
    const [scheme, token] = req.headers.authorization?.split(' ') ?? [];
    if (scheme !== 'Bearer' || !token) throw new UnauthorizedException();

    try {
      req.user = await this.tokens.verify(token);
    } catch (error) {
      if (error instanceof InvalidTokenError) throw new UnauthorizedException();
      throw error;
    }

    next();
  }
}
