import { Injectable } from '@nestjs/common';
import { User } from '../domain/user';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class InMemoryUserRepository extends UserRepository {
  private readonly users: User[] = [
    new User(
      '001',
      'admin@pp-scores.cl',
      '$2b$10$us2D2n.EH2xRtXazyA4qZONcyyws1hnlXTsLG7hS/THbxhumVUMau',
      'admin',
    ),
    new User(
      '002',
      'user@pp-scores.cl',
      '$2b$10$H4IfTJ7X9YCPx7M1RiXEp.0o.qk52RaymHX5hK/zZIZQPO8vLMwDy',
      'user',
      '11.111.111-1',
    ),
  ];

  findByEmail(email: string): Promise<User | null> {
    return Promise.resolve(this.users.find((u) => u.email === email) ?? null);
  }
}
