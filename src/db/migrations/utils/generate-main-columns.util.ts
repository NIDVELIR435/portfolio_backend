import { TableColumn, TableColumnOptions } from 'typeorm';

export const generateMainColumns = (
  name: 'id' | 'created_at' | 'updated_at' | 'description',
): TableColumnOptions => {
  switch (name) {
    case 'id':
      return new TableColumn({
        name: 'id',
        type: 'int4',
        isPrimary: true,
        isGenerated: true,
      });
    case 'created_at':
      return new TableColumn({
        name: 'created_at',
        type: 'timestamp',
        default: 'NOW()',
      });
    case 'updated_at':
      return new TableColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: 'NOW()',
      });
    case 'description':
      return new TableColumn({
        name: 'description',
        type: 'text',
        isNullable: true,
      });
  }
};
