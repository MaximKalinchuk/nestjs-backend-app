import { INestApplication } from "@nestjs/common";
import { DataSource } from "typeorm";

export async function truncateDBTables(app: INestApplication) {
  const dataSource = await app.resolve(DataSource);

  await dataSource.query(`
    CREATE OR REPLACE FUNCTION truncate_tables(username IN VARCHAR) RETURNS void AS $$
DECLARE
    statements CURSOR FOR
        SELECT tablename FROM pg_tables
        WHERE tableowner = username AND schemaname = 'public';
BEGIN
    FOR stmt IN statements LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(stmt.tablename) || ' CASCADE;';
    END LOOP;
END;
$$ LANGUAGE plpgsql;

SELECT truncate_tables('postgres');

`);


}

export async function dataBaseSeed(app: INestApplication) {
    const dataSource = await app.resolve(DataSource);
  await dataSource.query(
    `INSERT INTO roles (role, description) 
    VALUES 
    ('ADMIN', 'Администратор'), 
    ('USER', 'Пользователь'),
    ('MODER', 'Модератор')
    `,
  );

  await dataSource.query(
    `INSERT INTO users (username, email, password, banned, "BanReason", refresh_token) 
    VALUES 
    ('admin', 'admin@mail.ru', '$2a$05$b3PdP9IUTqw9IKUcDnVtCu3SbI8OmFHJFnsX14dRExP9OCc0g4Cd.', 'false', '', '$2a$10$S3n0RWFYcYii7aLkdb6hL.DfJDul0Fd/mSGkbmxW0billtV41Wskq')
    `,
  );

//   await dataSource.query(
//     `INSERT INTO users (username, email, password, banned, "BanReason", refresh_token) 
//     VALUES 
//     ('admin', 'admin@mail.ru', '$2a$05$b3PdP9IUTqw9IKUcDnVtCu3SbI8OmFHJFnsX14dRExP9OCc0g4Cd.', 'false', '', '$2a$10$S3n0RWFYcYii7aLkdb6hL.DfJDul0Fd/mSGkbmxW0billtV41Wskq')
//     `,
//   );

  await dataSource.query(
    `INSERT INTO users_user_roles_roles ("usersId", "rolesId") 
    VALUES 
    ('1', '1')
    `,
  );
}