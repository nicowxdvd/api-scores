export class InvalidRutError extends Error {
  constructor(input: string) {
    super(`Invalid rut: ${input}`);
    this.name = 'InvalidRutError';
  }
}
