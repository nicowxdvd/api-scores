import { Role } from '../../auth/domain/role';
import { ForbiddenScoreAccessError } from '../domain/forbidden-score-access.error';
import { Rut } from '../domain/rut';
import { ScoreCalculator } from '../domain/score-calculator';

export interface GetScoreInput {
  requester: { role: Role; rut?: string };
  rut: string;
}

export interface GetScoreOutput {
  rut: string;
  score: number;
  fecha: string;
}

export class GetScoreUseCase {
  constructor(private readonly calculator: ScoreCalculator) {}

  execute({ requester, rut }: GetScoreInput): GetScoreOutput {
    const target = Rut.create(rut);

    if (requester.role !== 'admin') {
      const ownsRut =
        requester.rut !== undefined && target.equals(Rut.create(requester.rut));
      if (!ownsRut) throw new ForbiddenScoreAccessError();
    }

    return {
      rut: target.value,
      score: this.calculator.calculate(target),
      fecha: new Date().toISOString(),
    };
  }
}
