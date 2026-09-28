import { JwtService } from '@nestjs/jwt';
import { InvalidTokenError } from '../domain/invalid-token.error';
import { JwtTokenService } from './jwt-token.service';

describe('JwtTokenService', () => {
  const jwt = new JwtService({ secret: 'test-secret' });
  const service = new JwtTokenService(jwt);

  it('verifies a token it signed and returns only the claims', async () => {
    const token = await service.sign({
      sub: '002',
      role: 'user',
      rut: '11.111.111-1',
    });

    await expect(service.verify(token)).resolves.toEqual({
      sub: '002',
      role: 'user',
      rut: '11.111.111-1',
    });
  });

  it('omits rut when the token has none', async () => {
    const token = await service.sign({ sub: '001', role: 'admin' });

    const payload = await service.verify(token);

    expect(payload).toEqual({ sub: '001', role: 'admin' });
    expect(payload).not.toHaveProperty('rut');
  });

  it('rejects a token signed with another secret', async () => {
    const token = await new JwtService({ secret: 'otro' }).signAsync({
      sub: '001',
      role: 'admin',
    });

    await expect(service.verify(token)).rejects.toBeInstanceOf(
      InvalidTokenError,
    );
  });

  it('rejects an expired token', async () => {
    const token = await jwt.signAsync(
      { sub: '001', role: 'admin' },
      { expiresIn: -10 },
    );

    await expect(service.verify(token)).rejects.toBeInstanceOf(
      InvalidTokenError,
    );
  });

  it('rejects a malformed token', async () => {
    await expect(service.verify('no-es-jwt')).rejects.toBeInstanceOf(
      InvalidTokenError,
    );
  });
});
