import { Role } from './role';

export class User {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly passwordHash: string,
    readonly role: Role,
    readonly rut?: string,
  ) {}
}
