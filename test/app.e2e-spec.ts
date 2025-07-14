import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { Game, Purchase } from '@prisma/client';

describe('AppModule (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const server = () => request(app.getHttpServer());

  it('/games (GET) returns 200', () => {
    return server().get('/games').expect(200);
  });

  it('/games POST returns 200', () => {
    const gameData = {
      name: 'my-game',
      releaseDate: new Date('1970-01-01').toISOString(),
    };
    return server()
      .post('/games')
      .send(gameData)
      .expect(201)
      .expect((res: { body: Game }) => {
        expect(res.body.name).toEqual(gameData.name);
        expect(res.body.releaseDate).toEqual(gameData.releaseDate);
      });
  });

  it('/games/a (DELETE) return 400', () => {
    return server().delete('/games/a').expect(400);
  });

  it('/games/123456789 (DELETE) return 404', () => {
    return server().delete('/games/123456789').expect(404);
  });

  it('/purchases (GET) returns 200', () => {
    return server().get('/purchases').expect(200);
  });

  it('/purchases POST returns 200', () => {
    const purchaseData = {
      amount: '99.99',
      date: new Date('1970-01-01').toISOString(),
      gameId: 1,
      type: 'Debit',
    };
    return server()
      .post('/purchases')
      .send(purchaseData)
      .expect(201)
      .expect((res: { body: Purchase }) => {
        expect(res.body.amount.toString()).toEqual(purchaseData.amount);
        expect(res.body.date).toEqual(purchaseData.date);
        expect(res.body.gameId).toEqual(purchaseData.gameId);
        expect(res.body.type).toEqual(purchaseData.type);
      });
  });

  it('/purchases POST bad .gameId returns 500', () => {
    const purchaseData = {
      amount: '99.99',
      date: new Date('1970-01-01').toISOString(),
      gameId: 123456789,
      type: 'Debit',
    };
    return server().post('/purchases').send(purchaseData).expect(500);
  });

  it('/purchases POST bad .amount returns 400', () => {
    const purchaseData = {
      amount: 'Apple',
    };
    return server().post('/purchases').send(purchaseData).expect(400);
  });

  it('/purchases/a (DELETE) return 400', () => {
    return server().delete('/purchases/a').expect(400);
  });

  it('/purchases/123456789 (DELETE) return 404', () => {
    return server().delete('/purchases/123456789').expect(404);
  });
});
