import { Module } from '@nestjs/common';
import { GetScoreUseCase } from './application/get-score.use-case';
import { ScoreCalculator } from './domain/score-calculator';
import { HashScoreCalculator } from './infrastructure/hash-score-calculator';
import { ScoreController } from './presentation/score.controller';

@Module({
  controllers: [ScoreController],
  providers: [
    { provide: ScoreCalculator, useClass: HashScoreCalculator },
    {
      provide: GetScoreUseCase,
      inject: [ScoreCalculator],
      useFactory: (calculator: ScoreCalculator) =>
        new GetScoreUseCase(calculator),
    },
  ],
})
export class ScoreModule {}
