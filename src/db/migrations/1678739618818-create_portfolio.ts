import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreatePortfolio1678739618818 implements MigrationInterface {
  private readonly tableName = 'portfolio';
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
      name: 'name',
      type: 'varchar',
      length: '1000',
      isNullable: false,
    }),
    new TableColumn({
      name: 'description',
      type: 'text',
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
      name: 'portfolio_user_id__user_id_fk',
      columnNames: ['user_id'],
      referencedTableName: 'user',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }),
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: this.columns,
        foreignKeys: this.foreignKeys,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
