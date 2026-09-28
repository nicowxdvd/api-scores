import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginUseCase } from '../application/login.use-case';
import { LoginRequestDto } from './dto/login.request.dto';

@Controller()
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() body: LoginRequestDto) {
    return this.loginUseCase.execute(body);
  }
}
