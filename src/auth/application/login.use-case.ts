import { InvalidCredentialsError } from '../domain/invalid-credentials.error';
import { PasswordHasher } from '../domain/password-hasher';
import { TokenService } from '../domain/token-service';
import { UserRepository } from '../domain/user.repository';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  accessToken: string;
}

export class LoginUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService,
  ) {}

  async execute({ email, password }: LoginInput): Promise<LoginOutput> {
    const user = await this.users.findByEmail(email);
    if (!user) throw new InvalidCredentialsError();

    const matches = await this.hasher.compare(password, user.passwordHash);
    if (!matches) throw new InvalidCredentialsError();

    const accessToken = await this.tokens.sign({
      sub: user.id,
      role: user.role,
      ...(user.rut && { rut: user.rut }),
    });

    return { accessToken };
  }
}
