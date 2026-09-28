import { InvalidCredentialsError } from '../domain/invalid-credentials.error';
import { PasswordHasher } from '../domain/password-hasher';
import { UserRepository } from '../domain/user.repository';

export interface LoginInput {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute({ email, password }: LoginInput): Promise<void> {
    const user = await this.users.findByEmail(email);
    if (!user) throw new InvalidCredentialsError();

    const matches = await this.hasher.compare(password, user.passwordHash);
    if (!matches) throw new InvalidCredentialsError();
  }
}
