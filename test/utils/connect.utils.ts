import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../../src/modules/app.module';
import { config } from './options';
import { truncateDBTables } from './sql-func.utils';



export const getAppForE2ETesting = async () => {
  const appModule: TestingModule = await Test.createTestingModule({
    imports: [TypeOrmModule.forRoot(config), AppModule],
  }).compile();

  const app = appModule.createNestApplication();


  app.use(cookieParser());
  app.enableCors();


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  await app.init();
  await truncateDBTables(app);
  return app;
};