import { Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { Rut } from '../domain/rut';
import { ScoreCalculator } from '../domain/score-calculator';

@Injectable()
export class HashScoreCalculator extends ScoreCalculator {
  calculate(rut: Rut): number {
    const digest = createHash('sha256').update(rut.value).digest();
    return digest.readUInt32BE(0) % 101;
  }
}
