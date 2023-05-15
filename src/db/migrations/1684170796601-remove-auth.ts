import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class removeAuth1684170796601 implements MigrationInterface {
  private readonly tableName = 'user_auth';
  private readonly columns = [
    new TableColumn({
      name: 'id',
      type: 'int4',
      isPrimary: true,
      isGenerated: true,
    }),
    new TableColumn({
      name: 'created_at',
      type: 'timestamp',
      default: 'NOW()',
    }),
    new TableColumn({
      name: 'updated_at',
      type: 'timestamp',
      default: 'NOW()',
    }),
    new TableColumn({
      name: 'refresh_token',
      type: 'varchar',
      length: '1000',
      isNullable: true,
    }),
    new TableColumn({
      name: 'user_id',
      type: 'int4',
      isNullable: true,
    }),
  ];
  private readonly foreignKeys = [
    new TableForeignKey({
      name: 'user_auth_user_id__user_id_fk',
      columnNames: ['user_id'],
      referencedTableName: 'user',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }),
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: this.columns,
        foreignKeys: this.foreignKeys,
      }),
    );
  }
}
