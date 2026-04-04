import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1775296108258 implements MigrationInterface {
  name = ' $npmConfigName1775296108258';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "test_column" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "test_column"`);
  }
}
