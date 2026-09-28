import { Rut } from '../domain/rut';
import { HashScoreCalculator } from './hash-score-calculator';

const checkDigit = (body: string): string => {
  let sum = 0;
  let weight = 2;
  for (const digit of [...body].reverse()) {
    sum += Number(digit) * weight;
    weight = weight === 7 ? 2 : weight + 1;
  }
  const result = 11 - (sum % 11);
  if (result === 11) return '0';
  if (result === 10) return 'K';
  return String(result);
};

const ruts = Array.from({ length: 500 }, (_, i) => {
  const body = String(10000000 + i * 7919);
  return Rut.create(`${body}-${checkDigit(body)}`);
});

describe('HashScoreCalculator', () => {
  const calculator = new HashScoreCalculator();

  it('returns the same score for the same rut', () => {
    const first = calculator.calculate(Rut.create('11.111.111-1'));
    const second = calculator.calculate(Rut.create('111111111'));

    expect(second).toBe(first);
  });

  it('returns integers between 0 and 100', () => {
    for (const rut of ruts) {
      const score = calculator.calculate(rut);
      expect(Number.isInteger(score)).toBe(true);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });

  it('varies between different ruts', () => {
    const scores = new Set(ruts.map((rut) => calculator.calculate(rut)));

    expect(scores.size).toBeGreaterThan(80);
  });
});
