import { UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';
import { InvalidTokenError } from '../domain/invalid-token.error';
import { JwtPayload } from '../domain/jwt-payload';
import { TokenService } from '../domain/token-service';
import { AuthenticatedRequest } from './authenticated-request';
import { JwtAuthMiddleware } from './jwt-auth.middleware';

class FakeTokenService extends TokenService {
  sign(): Promise<string> {
    return Promise.reject(new Error('not used'));
  }

  verify(token: string): Promise<JwtPayload> {
    if (token !== 'valid') return Promise.reject(new InvalidTokenError());
    return Promise.resolve({ sub: '002', role: 'user', rut: '11.111.111-1' });
  }
}

const requestWith = (authorization?: string) =>
  ({ headers: { authorization } }) as AuthenticatedRequest;

describe('JwtAuthMiddleware', () => {
  const middleware = new JwtAuthMiddleware(new FakeTokenService());
  const res = {} as Response;

  it('sets request.user and calls next with a valid token', async () => {
    const req = requestWith('Bearer valid');
    const next = jest.fn();

    await middleware.use(req, res, next);

    expect(req.user).toEqual({
      sub: '002',
      role: 'user',
      rut: '11.111.111-1',
    });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['missing header', undefined],
    ['wrong scheme', 'Basic valid'],
    ['missing token', 'Bearer'],
    ['invalid token', 'Bearer malo'],
  ])('rejects %s with 401', async (_name, header) => {
    const next = jest.fn();

    await expect(
      middleware.use(requestWith(header), res, next),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(next).not.toHaveBeenCalled();
  });
});
