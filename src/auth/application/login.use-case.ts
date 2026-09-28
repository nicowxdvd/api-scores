export interface LoginInput {
  email: string;
  password: string;
}

export class LoginUseCase {
  async execute(input: LoginInput): Promise<void> {}
}
