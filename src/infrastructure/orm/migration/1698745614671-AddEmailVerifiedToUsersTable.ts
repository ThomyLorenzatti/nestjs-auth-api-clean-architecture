import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailVerifiedToUsersTable1698745614671
  implements MigrationInterface
{
  name = 'AddEmailVerifiedToUsersTable1698745614671';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`email_verified\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`email_verified\``,
    );
  }
}
