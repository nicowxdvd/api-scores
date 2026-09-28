import { Rut } from './rut';

export abstract class ScoreCalculator {
  abstract calculate(rut: Rut): number;
}
