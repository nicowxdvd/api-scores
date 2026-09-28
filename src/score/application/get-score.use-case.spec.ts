import { ForbiddenScoreAccessError } from '../domain/forbidden-score-access.error';
import { InvalidRutError } from '../domain/invalid-rut.error';
import { Rut } from '../domain/rut';
import { ScoreCalculator } from '../domain/score-calculator';
import { GetScoreUseCase } from './get-score.use-case';

class FakeScoreCalculator extends ScoreCalculator {
  calculate(rut: Rut): number {
    return rut.value.length;
  }
}

describe('GetScoreUseCase', () => {
  const useCase = new GetScoreUseCase(new FakeScoreCalculator());

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-09-28T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('lets admin query any rut', () => {
    const result = useCase.execute({
      requester: { role: 'admin' },
      rut: '12.345.678-5',
    });

    expect(result).toEqual({
      rut: '123456785',
      score: 9,
      fecha: '2026-09-28T12:00:00.000Z',
    });
  });

  it('lets user query own rut in any format', () => {
    const result = useCase.execute({
      requester: { role: 'user', rut: '11.111.111-1' },
      rut: '111111111',
    });

    expect(result.rut).toBe('111111111');
  });

  it('rejects user querying another rut', () => {
    expect(() =>
      useCase.execute({
        requester: { role: 'user', rut: '11.111.111-1' },
        rut: '12.345.678-5',
      }),
    ).toThrow(ForbiddenScoreAccessError);
  });

  it('rejects user without rut in token', () => {
    expect(() =>
      useCase.execute({
        requester: { role: 'user' },
        rut: '11.111.111-1',
      }),
    ).toThrow(ForbiddenScoreAccessError);
  });

  it('rejects invalid rut', () => {
    expect(() =>
      useCase.execute({ requester: { role: 'admin' }, rut: '11.111.111-2' }),
    ).toThrow(InvalidRutError);
  });
});
