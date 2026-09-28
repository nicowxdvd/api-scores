import { User } from './user';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
}
