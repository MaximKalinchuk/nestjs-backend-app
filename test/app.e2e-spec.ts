import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app.module';
// import { getAppForE2ETesting } from './utils/connect.utils';
import { truncateDBTables } from './utils/sql-func.utils';
import { CreateUserInputModel } from '../src/modules/users/api/models/createUser.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './utils/options';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(config), AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Registration - /login', () => {

    const requestRegisterUser: CreateUserInputModel = {
      username: "max",
      email: "max@mail.ru",
      password: "123"
    }

    const requestLoginUser = {
      email: "max@mail.ru",
      password: "123"
    } 

    beforeAll(async () => {
      await truncateDBTables(app)
    });

    it('should return new access token [POST -> 200]', async () => {
      return request(app.getHttpServer())
      .post('/register')
      .send(requestRegisterUser)
      .expect(201)
    })

    it('should return new access and refresh tokens [POST -> 201]', async () => {
      return request(app.getHttpServer())
        .post('/login')
        .send(requestLoginUser)
        .expect(201)
        // .expect('Hello World!');
    });

  })
});
