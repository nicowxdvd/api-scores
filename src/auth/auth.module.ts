import { Module } from '@nestjs/common';
import { LoginUseCase } from './application/login.use-case';
import { PasswordHasher } from './domain/password-hasher';
import { UserRepository } from './domain/user.repository';
import { BcryptPasswordHasher } from './infrastructure/bcrypt-password-hasher';
import { InMemoryUserRepository } from './infrastructure/in-memory-user.repository';
import { AuthController } from './presentation/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [
    { provide: UserRepository, useClass: InMemoryUserRepository },
    { provide: PasswordHasher, useClass: BcryptPasswordHasher },
    {
      provide: LoginUseCase,
      inject: [UserRepository, PasswordHasher],
      useFactory: (users: UserRepository, hasher: PasswordHasher) =>
        new LoginUseCase(users, hasher),
    },
  ],
})
export class AuthModule {}
