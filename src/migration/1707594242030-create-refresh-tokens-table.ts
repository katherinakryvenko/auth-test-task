import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateRefreshTokensTable1707594242030
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'refresh_tokens',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'token',
            type: 'uuid',
            isUnique: true,
          },
          {
            name: 'expiryDate',
            type: 'timestamp',
          },
          {
            name: 'issuedAt',
            type: 'timestamp',
          },
          {
            name: 'userId',
            type: 'int',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'refresh_tokens',
      new TableIndex({
        name: 'IDX_REFRESH_TOKEN_TOKEN',
        columnNames: ['token'],
      }),
    );

    await queryRunner.createIndex(
      'refresh_tokens',
      new TableIndex({
        name: 'IDX_REFRESH_TOKEN_USER_ID',
        columnNames: ['userId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('refresh_tokens', 'IDX_REFRESH_TOKEN_TOKEN');
    await queryRunner.dropIndex('refresh_tokens', 'IDX_REFRESH_TOKEN_USER_ID');

    await queryRunner.dropTable('refresh_tokens');
  }
}
