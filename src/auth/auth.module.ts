import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { LoginUseCase } from './application/login.use-case';
import { PasswordHasher } from './domain/password-hasher';
import { TokenService } from './domain/token-service';
import { UserRepository } from './domain/user.repository';
import { BcryptPasswordHasher } from './infrastructure/bcrypt-password-hasher';
import { InMemoryUserRepository } from './infrastructure/in-memory-user.repository';
import { JwtTokenService } from './infrastructure/jwt-token.service';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.getOrThrow<string>(
            'JWT_EXPIRES_IN',
          ) as JwtSignOptions['expiresIn'],
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: UserRepository, useClass: InMemoryUserRepository },
    { provide: PasswordHasher, useClass: BcryptPasswordHasher },
    { provide: TokenService, useClass: JwtTokenService },
    {
      provide: LoginUseCase,
      inject: [UserRepository, PasswordHasher, TokenService],
      useFactory: (
        users: UserRepository,
        hasher: PasswordHasher,
        tokens: TokenService,
      ) => new LoginUseCase(users, hasher, tokens),
    },
  ],
})
export class AuthModule {}
