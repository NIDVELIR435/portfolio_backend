import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreateImageComment1678741334002 implements MigrationInterface {
  private readonly tableName = 'image_comment';
  private readonly columns = [
    new TableColumn({
      name: 'image_id',
      type: 'int4',
      isNullable: true,
    }),
    new TableColumn({
      name: 'comment_id',
      type: 'int4',
      isNullable: true,
    }),
  ];
  private readonly foreignKeys = [
    new TableForeignKey({
      name: 'image_comment_image_id__image_id_fk',
      columnNames: ['image_id'],
      referencedTableName: 'image',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }),
    new TableForeignKey({
      name: 'image_comment_comment_id__comment_id_fk',
      columnNames: ['comment_id'],
      referencedTableName: 'comment',
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
