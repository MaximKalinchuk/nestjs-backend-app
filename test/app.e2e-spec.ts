import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { truncateDBTables } from './utils/sql-func.utils';
import { CreateUserInputModel } from '../src/modules/users/api/models/createUser.model';
import { getAppForE2ETesting } from './utils/connect.utils';
import { responseHeadersAuth } from './utils/get-token-from-response';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await getAppForE2ETesting();
  });

  afterAll(async () => {
    await truncateDBTables(app);
    await app.close();
  });

  describe('Registration | Login | Refresh | Logout', () => {

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

    let access_token_user;
    let refresh_token_user;

    it('/register = should return new access token [POST -> 200]', async () => {
      const response = await request(app.getHttpServer())
      .post('/register')
      .send(requestRegisterUser)
      .expect(201)


      const { access_token, refresh_token } = responseHeadersAuth(response);

      expect(access_token).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
      );
      expect(refresh_token).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
      );
      access_token_user = access_token
      refresh_token_user = refresh_token

      return response
    })

    

    it('/login = should return new access and refresh tokens [POST -> 201]', async () => {
      const response = await request(app.getHttpServer())
         .post('/login')
         .send(requestLoginUser)
         .expect(201)
         

         const { access_token, refresh_token } = responseHeadersAuth(response);
 
         expect(access_token).toMatch(
           /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
         );
         expect(refresh_token).toMatch(
           /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
         );
   
         access_token_user = access_token
         refresh_token_user = refresh_token


         await new Promise(resolve => setTimeout(resolve, 3000)); // делаю задержку перед следующим тестом из-за функции generateToken. При быстрой повторной отправки токены генерируются одинаковые!

         return response
         
     });

     it('/refresh = should return new access and refresh tokens [POST -> 201]', async () => {


        const response = await request(app.getHttpServer())
        .post('/refresh')
        .set('Cookie', refresh_token_user)
        .send()
        .expect(201)

        const { access_token, refresh_token } = responseHeadersAuth(response);
        expect(access_token).toMatch(
          /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
        );
        expect(refresh_token).toMatch(
          /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
        );
        expect(access_token).not.toEqual(access_token_user)
        expect(refresh_token).not.toEqual(refresh_token_user)

    
        access_token_user = access_token
        refresh_token_user = refresh_token

        return response
    });

     it('/logout = should return string [POST -> 201]', async () => {
      const response = await request(app.getHttpServer())
      .post('/logout')
      .set('Authorization', `Bearer ${access_token_user}`)
      .set('Cookie', refresh_token_user)
      .expect(201)
      .expect('Вы успешно вышли из системы.')

      return response
    });

  })

})
