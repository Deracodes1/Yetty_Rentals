import { MigrationInterface, QueryRunner } from "typeorm";

export class Updateuserroletouser1775687308316 implements MigrationInterface {
    name = 'Updateuserroletouser1775687308316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'admin'`);
    }

}
