import { Role } from './role';

export abstract class TokenService {
  abstract sign(payload: {
    sub: string;
    role: Role;
    rut?: string;
  }): Promise<string>;
}
