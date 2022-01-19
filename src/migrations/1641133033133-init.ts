import {MigrationInterface, QueryRunner} from "typeorm";

export class init1641133033133 implements MigrationInterface {
    name = 'init1641133033133'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "user_role_enum" AS ENUM('USER', 'ADMIN', 'MODERATOR')`,undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" text NOT NULL, "phoneNumber" numeric, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'USER', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "log_entry" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text, "comments" text, "imageUrl" text, "location" jsonb NOT NULL, "visitDate" date, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_45e2f8fa5e70dd60266d2f94d49" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "log_entry" ADD CONSTRAINT "FK_1e40c93ad0f32b59845fa0b66d4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "log_entry" DROP CONSTRAINT "FK_1e40c93ad0f32b59845fa0b66d4"`);
        await queryRunner.query(`DROP TABLE "log_entry"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "user_role_enum"`,undefined);
    }

}
