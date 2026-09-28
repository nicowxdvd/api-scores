import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('POST /login (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  const login = (body: object) =>
    request(app.getHttpServer()).post('/login').send(body);

  it('returns 200 for admin', () => {
    return login({ email: 'admin@pp-scores.cl', password: '@dmin' }).expect(
      200,
    );
  });

  it('returns 200 for user', () => {
    return login({ email: 'user@pp-scores.cl', password: '123456' }).expect(
      200,
    );
  });

  it('returns 401 on wrong password', async () => {
    const res = await login({
      email: 'user@pp-scores.cl',
      password: 'mala',
    }).expect(401);

    expect(res.body).toEqual({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid credentials',
    });
  });

  it('returns 401 on unknown email', () => {
    return login({ email: 'nadie@pp-scores.cl', password: 'x' }).expect(401);
  });

  it('returns 400 on invalid email', () => {
    return login({ email: 'malo', password: 'x' }).expect(400);
  });

  it('returns 400 on empty email', () => {
    return login({ email: '', password: 'x' }).expect(400);
  });

  it('returns 400 on missing password', () => {
    return login({ email: 'user@pp-scores.cl' }).expect(400);
  });

  it('returns 400 when a field exceeds 40 characters', () => {
    return login({
      email: 'user@pp-scores.cl',
      password: 'a'.repeat(41),
    }).expect(400);
  });

  it('returns 400 on extra fields', () => {
    return login({
      email: 'user@pp-scores.cl',
      password: '123456',
      extra: 1,
    }).expect(400);
  });
});
