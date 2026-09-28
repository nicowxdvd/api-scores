import { Role } from './role';

export interface JwtPayload {
  sub: string;
  role: Role;
  rut?: string;
}
