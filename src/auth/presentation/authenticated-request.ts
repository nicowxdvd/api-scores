import type { Request } from 'express';
import { JwtPayload } from '../domain/jwt-payload';

export type AuthenticatedRequest = Request & { user?: JwtPayload };
