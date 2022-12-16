import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { truncateDBTables } from './utils/sql-func.utils';
import { CreateUserInputModel } from '../src/modules/users/api/models/createUser.model';
import { getAppForE2ETesting } from './utils/connect.utils';
import { responseHeadersAuth } from './utils/get-token-from-response';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await getAppForE2ETesting();
  });

  afterAll(async () => {
    await truncateDBTables(app);
    await app.close();
  });

  describe('Registration | Login | Refresh | Logout', () => {

    beforeAll(async () => {
      await truncateDBTables(app)
    });

    let access_token_user;
    let refresh_token_user;

    it('/register = should return new access token [POST -> 201]', async () => {

      const requestRegisterUser: CreateUserInputModel = {
        username: "max",
        email: "max@mail.ru",
        password: "123"
      }

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
    })

    it('/login = should return new access and refresh tokens [POST -> 200]', async () => {

      const requestLoginUser = {
        email: "max@mail.ru",
        password: "123"
      } 

      const response = await request(app.getHttpServer())
         .post('/login')
         .send(requestLoginUser)
         .expect(200)
         

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

     });

     it('/refresh = should return new access and refresh tokens [POST -> 200]', async () => {


        const response = await request(app.getHttpServer())
        .post('/refresh')
        .set('Cookie', refresh_token_user)
        .expect(200)

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

    });

     it('/logout = should return string [POST -> 200]', async () => {
      const response = await request(app.getHttpServer())
      .post('/logout')
      .set('Cookie', refresh_token_user)
      .expect(200)
      .expect('Вы успешно вышли из системы.')

    });

    describe('register - Bad requests', () => {
      it('Bad /register = should return error messeges [POST -> 400]', async () => {
      
        const badRequestRegisterUser: CreateUserInputModel = {
          username: "max1",
          email: "maxmail.ru",
          password: "123"
        }
  
        const response = await request(app.getHttpServer())
        .post('/register')
        .send(badRequestRegisterUser)
        .expect(400)
  
        const emailValidError = response.body.message[0]
        expect(emailValidError).toEqual('email must be an email')
      })

      it('Duplicate user /register = should return error messeges [POST -> 401]', async () => {
      
        const badRequestRegisterUser: CreateUserInputModel = {
          username: "max",
          email: "max@mail.ru",
          password: "123"
        }
  
        const response = await request(app.getHttpServer())
        .post('/register')
        .send(badRequestRegisterUser)
        .expect(401)
  
        const emailValidError = response.body.message
        expect(emailValidError).toEqual('Такой email уже зарегистрирован')
      })
    })

    describe('login - Bad requests', () => {
      it('Bad /login = should return Unauthorized [POST -> 401]', async () => {

        const badRequestLoginUser = {
          email: "maxa@mail.ru",
          password: "123"
        } 
  
        const response = await request(app.getHttpServer())
           .post('/login')
           .send(badRequestLoginUser)
           .expect(401)
  
       });
    })

  })
/* -----------------------------------------------------------------------------------------  */
/* -----------------------------------------------------------------------------------------  */
/* -----------------------------------------------------------------------------------------  */
  describe('Registration new User | GiveBan to new User | GiveRole to new User', () => {

    const requestRegisterUser: CreateUserInputModel = {
      username: "alex",
      email: "alex@mail.ru",
      password: "123"
    }


    let access_token_user;
    let refresh_token_user;

    it('/register = should return new access token [POST -> 201]', async () => {
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

    })

     it('/users = should return all users [POST -> 200]', async () => {


        const response = await request(app.getHttpServer())
        .get('/users')
        .set('Cookie', refresh_token_user)
        .set('Authorization', `Bearer ${access_token_user}`)
        .expect(200)

        // const user = response.body

    });

    it('/users/ban = should return user with ban = true [POST -> 200]', async () => {

      const BanInputData = {
        username: 'alex',
        BanReason: 'Плохой человек'
      }

      const response = await request(app.getHttpServer())
      .post('/users/ban')
      .set('Cookie', refresh_token_user)
      .set('Authorization', `Bearer ${access_token_user}`)
      .send(BanInputData)
      .expect(200)

      const user = response.body
      expect(user.banned).toEqual(true)

  });

    it('/users/role = should return user with new role  [POST -> 200]', async () => {

      const RoleInputData = {
        username: 'alex',
        BanReason: 'MODER'
      }

      const response = await request(app.getHttpServer())
      .post('/users/role')
      .set('Cookie', refresh_token_user)
      .set('Authorization', `Bearer ${access_token_user}`)
      .send(RoleInputData)
      .expect(200)

      const user = response.body
      expect(user.userRoles.role).toEqual('MODER')

    });
  })
})

