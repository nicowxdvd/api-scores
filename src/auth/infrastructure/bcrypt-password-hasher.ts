import { Injectable } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { PasswordHasher } from '../domain/password-hasher';

@Injectable()
export class BcryptPasswordHasher extends PasswordHasher {
  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
