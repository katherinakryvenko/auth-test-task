import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateUsersTable1707573139842 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          {
            name: 'username',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          { name: 'password', type: 'varchar', isNullable: false },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERNAME',
        columnNames: ['username'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('users', 'IDX_USERNAME');
    await queryRunner.dropTable('users');
  }
}
