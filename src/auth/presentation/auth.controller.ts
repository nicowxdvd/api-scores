import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginRequestDto } from './dto/login.request.dto';

@Controller()
export class AuthController {
  @Post('login')
  @HttpCode(200)
  login(@Body() body: LoginRequestDto) {}
}
