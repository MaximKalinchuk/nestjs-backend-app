import { INestApplication } from "@nestjs/common";
import { DataSource } from "typeorm";

export async function truncateDBTables(app: INestApplication) {
  const dataSource = await app.resolve(DataSource);
  //console.log(dataSource)

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

// export async function getAllUsers(
//   app: INestApplication,
// ) {
//   const dataSource = await app.resolve(DataSource);
//   return await dataSource.query(`
//   SELECT *
// 	FROM "users";`);
// }