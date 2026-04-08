import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserRoleDefault1775685359522 implements MigrationInterface {
  name = 'UpdateUserRoleDefault1775685359522';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'admin'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user'`,
    );
  }
}
