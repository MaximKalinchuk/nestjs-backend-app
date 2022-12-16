import { MigrationInterface, QueryRunner } from "typeorm";

export class createDataBase1671170631329 implements MigrationInterface {
    name = 'createDataBase1671170631329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "role" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "banned" boolean NOT NULL DEFAULT false, "BanReason" character varying DEFAULT '', "refresh_token" character varying, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_user_roles_roles" ("usersId" integer NOT NULL, "rolesId" integer NOT NULL, CONSTRAINT "PK_fcc0fae9cea7b98b53b3ab1b88c" PRIMARY KEY ("usersId", "rolesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5dbe1099e91770e2566fbf3369" ON "users_user_roles_roles" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_64b99c8d4f4f9289a9d3f3a893" ON "users_user_roles_roles" ("rolesId") `);
        await queryRunner.query(`ALTER TABLE "users_user_roles_roles" ADD CONSTRAINT "FK_5dbe1099e91770e2566fbf33695" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_user_roles_roles" ADD CONSTRAINT "FK_64b99c8d4f4f9289a9d3f3a893f" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_user_roles_roles" DROP CONSTRAINT "FK_64b99c8d4f4f9289a9d3f3a893f"`);
        await queryRunner.query(`ALTER TABLE "users_user_roles_roles" DROP CONSTRAINT "FK_5dbe1099e91770e2566fbf33695"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_64b99c8d4f4f9289a9d3f3a893"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5dbe1099e91770e2566fbf3369"`);
        await queryRunner.query(`DROP TABLE "users_user_roles_roles"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
