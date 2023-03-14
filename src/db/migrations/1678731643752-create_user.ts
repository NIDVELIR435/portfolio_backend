import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreateUser1678731643752 implements MigrationInterface {
  private readonly tableName = 'user';
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
      name: 'first_name',
      type: 'text',
      isNullable: false,
    }),
    new TableColumn({
      name: 'last_name',
      type: 'text',
      isNullable: false,
    }),
    new TableColumn({
      name: 'email',
      type: 'varchar',
      length: '200',
      isNullable: false,
    }),
    new TableColumn({
      name: 'password',
      type: 'varchar',
      length: '2000',
      isNullable: false,
    }),
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: this.columns,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
