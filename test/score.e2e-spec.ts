import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('GET /score (e2e)', () => {
  let app: INestApplication<App>;
  let jwt: JwtService;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '1h';
  });

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
    jwt = app.get(JwtService, { strict: false });
  });

  afterEach(async () => {
    await app.close();
  });

  const tokenFor = async (email: string, password: string) => {
    const res = await request(app.getHttpServer())
      .post('/login')
      .send({ email, password })
      .expect(200);
    return (res.body as { accessToken: string }).accessToken;
  };

  const getScore = (rut: string, token?: string) => {
    const req = request(app.getHttpServer()).get('/score').query({ rut });
    return token ? req.set('Authorization', `Bearer ${token}`) : req;
  };

  it('returns score for any rut to admin', async () => {
    const token = await tokenFor('admin@pp-scores.cl', '@dmin');

    const res = await getScore('12.345.678-5', token).expect(200);

    expect(res.body).toEqual({
      rut: '123456785',
      score: expect.any(Number) as number,
      fecha: expect.any(String) as string,
    });
    const { score } = res.body as { score: number };
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('returns score to user for own rut', async () => {
    const token = await tokenFor('user@pp-scores.cl', '123456');

    const res = await getScore('11111111-1', token).expect(200);

    expect(res.body).toMatchObject({ rut: '111111111' });
  });

  it('returns same score for same rut', async () => {
    const token = await tokenFor('admin@pp-scores.cl', '@dmin');

    const first = await getScore('12345678-5', token).expect(200);
    const second = await getScore('12.345.678-5', token).expect(200);

    expect((first.body as { score: number }).score).toBe(
      (second.body as { score: number }).score,
    );
  });

  it('returns 403 to user for other rut', async () => {
    const token = await tokenFor('user@pp-scores.cl', '123456');

    await getScore('12.345.678-5', token).expect(403);
  });

  it('returns 401 without token', () => {
    return getScore('11.111.111-1').expect(401);
  });

  it('returns 401 with expired token', async () => {
    const expired = await jwt.signAsync(
      { sub: '001', role: 'admin' },
      { expiresIn: -10 },
    );

    await getScore('11.111.111-1', expired).expect(401);
  });

  it('returns 400 on invalid rut', async () => {
    const token = await tokenFor('admin@pp-scores.cl', '@dmin');

    await getScore('11.111.111-2', token).expect(400);
  });

  it('returns 400 on missing rut', async () => {
    const token = await tokenFor('admin@pp-scores.cl', '@dmin');

    await request(app.getHttpServer())
      .get('/score')
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });
});
