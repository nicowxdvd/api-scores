import { InvalidCredentialsError } from '../domain/invalid-credentials.error';
import { PasswordHasher } from '../domain/password-hasher';
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

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;

  beforeEach(() => {
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
    );
  });

  it('resolves with valid credentials', async () => {
    await expect(
      useCase.execute({ email: 'admin@pp-scores.cl', password: '@dmin' }),
    ).resolves.toBeUndefined();
  });

  it('rejects unknown email', async () => {
    await expect(
      useCase.execute({ email: 'nadie@pp-scores.cl', password: '@dmin' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('rejects wrong password', async () => {
    await expect(
      useCase.execute({ email: 'user@pp-scores.cl', password: 'mala' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
