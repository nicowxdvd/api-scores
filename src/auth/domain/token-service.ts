import { JwtPayload } from './jwt-payload';

export abstract class TokenService {
  abstract sign(payload: JwtPayload): Promise<string>;
  abstract verify(token: string): Promise<JwtPayload>;
}
