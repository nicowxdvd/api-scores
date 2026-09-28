import { Controller, Get, Query, Req, UseFilters } from '@nestjs/common';
import type { AuthenticatedRequest } from '../../auth/presentation/authenticated-request';
import { GetScoreUseCase } from '../application/get-score.use-case';
import { GetScoreQueryDto } from './dto/get-score.query.dto';
import { ScoreErrorsFilter } from './score-errors.filter';

@Controller('score')
@UseFilters(ScoreErrorsFilter)
export class ScoreController {
  constructor(private readonly getScoreUseCase: GetScoreUseCase) {}

  @Get()
  get(@Query() query: GetScoreQueryDto, @Req() req: AuthenticatedRequest) {
    return this.getScoreUseCase.execute({
      requester: req.user!,
      rut: query.rut,
    });
  }
}
