import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seed1639029201277 implements MigrationInterface {
  name = 'Seed1639029201277';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO roles (role, description) 
      VALUES 
      ('ADMIN', 'Администратор'), 
      ('USER', 'Пользователь'),
      ('MODER', 'Модератор')
      `,
    );

    await queryRunner.query(
      `INSERT INTO users (username, email, password, banned, "BanReason", refresh_token) 
      VALUES 
      ('admin', 'admin@mail.ru', '$2a$05$b3PdP9IUTqw9IKUcDnVtCu3SbI8OmFHJFnsX14dRExP9OCc0g4Cd.', 'false', '', '$2a$10$S3n0RWFYcYii7aLkdb6hL.DfJDul0Fd/mSGkbmxW0billtV41Wskq'),
      ('alex', 'alex@mail.ru', '$2a$05$b3PdP9IUTqw9IKUcDnVtCu3SbI8OmFHJFnsX14dRExP9OCc0g4Cd.', 'false', '', '$2a$10$iPIUiXO11xpVot10ZXoChOVmyVo89Y8vwVR13bvxD/02z8YpLvcCO')
      `,
    );

    await queryRunner.query(
      `INSERT INTO users_user_roles_roles ("usersId", "rolesId") 
      VALUES 
      ('1', '1'),
      ('2', '2')
      `,
    );
  }

  

  public async down(): Promise<void> {}
}
