import { Module } from '@nestjs/common';
import { LoginUseCase } from './application/login.use-case';
import { AuthController } from './presentation/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [LoginUseCase],
})
export class AuthModule {}
