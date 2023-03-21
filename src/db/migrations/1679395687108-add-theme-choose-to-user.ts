import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { UiTheme } from '../entities/enums/ui-theme.enum';

export class AddThemeChooseToUser1679395687108 implements MigrationInterface {
  private readonly tableName = 'user';
  private readonly column = new TableColumn({
    name: 'ui_theme',
    type: 'enum',
    enum: Object.values(UiTheme),
    default: `'${UiTheme.light}'`,
    isNullable: true,
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(this.tableName, this.column);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.tableName, this.column);
  }
}
