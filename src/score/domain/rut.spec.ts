import { InvalidRutError } from './invalid-rut.error';
import { Rut } from './rut';

describe('Rut', () => {
  it('normalizes formats to the same value', () => {
    const values = ['11.111.111-1', '11111111-1', '111111111'].map(
      (input) => Rut.create(input).value,
    );

    expect(values).toEqual(['111111111', '111111111', '111111111']);
  });

  it('accepts ruts with K as check digit in any case', () => {
    expect(Rut.create('10.000.013-K').value).toBe('10000013K');
    expect(Rut.create('10000013-k').value).toBe('10000013K');
  });

  it('accepts ruts with 7 digit body', () => {
    expect(Rut.create('1.000.005-K').value).toBe('1000005K');
  });

  it('rejects wrong check digit', () => {
    expect(() => Rut.create('11.111.111-2')).toThrow(InvalidRutError);
  });

  it.each([
    '',
    'abc',
    '11.11.111-1',
    '1111-1',
    '11.111.111-11',
    '11 111 111-1',
  ])('rejects malformed rut "%s"', (input) => {
    expect(() => Rut.create(input)).toThrow(InvalidRutError);
  });

  it('compares by normalized value', () => {
    expect(Rut.create('11.111.111-1').equals(Rut.create('111111111'))).toBe(
      true,
    );
    expect(Rut.create('11.111.111-1').equals(Rut.create('12.345.678-5'))).toBe(
      false,
    );
  });
});
