import { Body, Controller, HttpCode, Post, UseFilters } from '@nestjs/common';
import { LoginUseCase } from '../application/login.use-case';
import { LoginRequestDto } from './dto/login.request.dto';
import { InvalidCredentialsFilter } from './invalid-credentials.filter';

@Controller()
@UseFilters(InvalidCredentialsFilter)
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() body: LoginRequestDto) {
    return this.loginUseCase.execute(body);
  }
}
