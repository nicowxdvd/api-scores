export class ForbiddenScoreAccessError extends Error {
  constructor() {
    super('Forbidden score access');
    this.name = 'ForbiddenScoreAccessError';
  }
}
