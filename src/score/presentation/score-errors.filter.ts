import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';
import { ForbiddenScoreAccessError } from '../domain/forbidden-score-access.error';
import { InvalidRutError } from '../domain/invalid-rut.error';

@Catch(InvalidRutError, ForbiddenScoreAccessError)
export class ScoreErrorsFilter implements ExceptionFilter {
  catch(
    error: InvalidRutError | ForbiddenScoreAccessError,
    host: ArgumentsHost,
  ) {
    const [statusCode, name] =
      error instanceof InvalidRutError
        ? [400, 'Bad Request']
        : [403, 'Forbidden'];
    host.switchToHttp().getResponse<Response>().status(statusCode).json({
      statusCode,
      error: name,
      message: error.message,
    });
  }
}
