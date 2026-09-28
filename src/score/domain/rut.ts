import { InvalidRutError } from './invalid-rut.error';

const FORMAT = /^(\d{1,2}(\.\d{3}){2}|\d{7,8})-?[\dkK]$/;

export class Rut {
  private constructor(readonly value: string) {}

  static create(input: string): Rut {
    if (!FORMAT.test(input)) throw new InvalidRutError(input);

    const value = input.replace(/[.-]/g, '').toUpperCase();
    const body = value.slice(0, -1);
    if (Rut.checkDigit(body) !== value.slice(-1)) {
      throw new InvalidRutError(input);
    }

    return new Rut(value);
  }

  equals(other: Rut): boolean {
    return this.value === other.value;
  }

  private static checkDigit(body: string): string {
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
  }
}
