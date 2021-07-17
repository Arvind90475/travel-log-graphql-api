import {MigrationInterface, QueryRunner} from "typeorm";

export class postRefactoringUserEntity1626535920093 implements MigrationInterface {
    name = 'postRefactoringUserEntity1626535920093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastName"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "lastName" character varying NOT NULL`);
    }

}
