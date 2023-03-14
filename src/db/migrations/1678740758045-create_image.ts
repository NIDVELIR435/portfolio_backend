import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreateImage1678740758045 implements MigrationInterface {
  private readonly tableName = 'image';
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
      name: 'url',
      type: 'text',
      isNullable: false,
    }),
    new TableColumn({
      name: 'description',
      type: 'text',
      isNullable: true,
    }),
    new TableColumn({
      name: 'portfolio_id',
      type: 'int4',
      isNullable: false,
    }),
  ];
  private readonly foreignKeys = [
    new TableForeignKey({
      name: 'image_portfolio_id__portfolio_id_fk',
      columnNames: ['portfolio_id'],
      referencedTableName: 'portfolio',
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
