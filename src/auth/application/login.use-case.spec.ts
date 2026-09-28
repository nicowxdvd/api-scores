import { InvalidCredentialsError } from '../domain/invalid-credentials.error';
import { PasswordHasher } from '../domain/password-hasher';
import { TokenService } from '../domain/token-service';
import { User } from '../domain/user';
import { UserRepository } from '../domain/user.repository';
import { LoginUseCase } from './login.use-case';

class FakeUserRepository extends UserRepository {
  constructor(private readonly users: User[]) {
    super();
  }

  findByEmail(email: string): Promise<User | null> {
    return Promise.resolve(this.users.find((u) => u.email === email) ?? null);
  }
}

class FakePasswordHasher extends PasswordHasher {
  compare(plain: string, hash: string): Promise<boolean> {
    return Promise.resolve(`hash:${plain}` === hash);
  }
}

class FakeTokenService extends TokenService {
  signed: Parameters<TokenService['sign']>[0][] = [];

  sign(payload: Parameters<TokenService['sign']>[0]): Promise<string> {
    this.signed.push(payload);
    return Promise.resolve('token');
  }

  verify(): Promise<Parameters<TokenService['sign']>[0]> {
    return Promise.reject(new Error('not used'));
  }
}

describe('LoginUseCase', () => {
  let tokens: FakeTokenService;
  let useCase: LoginUseCase;

  beforeEach(() => {
    tokens = new FakeTokenService();
    useCase = new LoginUseCase(
      new FakeUserRepository([
        new User('001', 'admin@pp-scores.cl', 'hash:@dmin', 'admin'),
        new User(
          '002',
          'user@pp-scores.cl',
          'hash:123456',
          'user',
          '11.111.111-1',
        ),
      ]),
      new FakePasswordHasher(),
      tokens,
    );
  });

  it('returns token without rut when user has none', async () => {
    const result = await useCase.execute({
      email: 'admin@pp-scores.cl',
      password: '@dmin',
    });

    expect(result).toEqual({ accessToken: 'token' });
    expect(tokens.signed[0]).toEqual({ sub: '001', role: 'admin' });
    expect(tokens.signed[0]).not.toHaveProperty('rut');
  });

  it('returns token with rut when user has one', async () => {
    await useCase.execute({ email: 'user@pp-scores.cl', password: '123456' });

    expect(tokens.signed[0]).toEqual({
      sub: '002',
      role: 'user',
      rut: '11.111.111-1',
    });
  });

  it('rejects unknown email', async () => {
    await expect(
      useCase.execute({ email: 'nadie@pp-scores.cl', password: '@dmin' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
    expect(tokens.signed).toHaveLength(0);
  });

  it('rejects wrong password', async () => {
    await expect(
      useCase.execute({ email: 'user@pp-scores.cl', password: 'mala' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
    expect(tokens.signed).toHaveLength(0);
  });
});
