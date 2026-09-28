import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';
import { InvalidCredentialsError } from '../domain/invalid-credentials.error';

@Catch(InvalidCredentialsError)
export class InvalidCredentialsFilter implements ExceptionFilter {
  catch(error: InvalidCredentialsError, host: ArgumentsHost) {
    host.switchToHttp().getResponse<Response>().status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: error.message,
    });
  }
}
