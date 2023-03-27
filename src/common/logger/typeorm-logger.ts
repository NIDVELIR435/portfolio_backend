import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';
import { isArray, isEmpty, isNil, isObject } from 'lodash';
import { Logger } from '@nestjs/common';

export class TypeormCustomLogger implements TypeOrmLogger {
  private readonly stack = 'Typeorm#PostgresSQL';
  private readonly logging: boolean;
  private readonly colorCode = {
    blue: '\x1b[34m',
    grey: '\x1b[37m',
    yellow: '\x1b[33;20m',
    red: '\x1b[31m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
  };
  private readonly transactionKeywords = [
    'START',
    'TRANSACTION',
    'COMMIT',
    'ROLLBACK',
    'SERIALIZABLE',
    'ISOLATION',
    'READ',
    'COMMITTED',
    'UNCOMMITTED',
    'REPEATABLE',
    'LEVEL',
    'SERIALIZABLE',
  ];
  private readonly keywords = [
    'UPDATE ',
    ' SET ',
    'PARTITION BY',
    ' ORDER BY ',
    'ALL',
    'ANALYSE',
    'ANALYZE',
    ' AND ',
    'ANY',
    'ARRAY',
    ' AS ',
    'ASC',
    'ASYMMETRIC',
    'AUTHORIZATION',
    'BINARY',
    'BOTH',
    'CASE',
    'DESC',
    'DISTINCT',
    ' FROM ',
    'HAVING',
    'ILIKE',
    'INNER',
    'JOIN',
    'LEFT',
    'LIKE',
    'LIMIT',
    'NOT',
    'NOTNULL',
    'IS NULL',
    'IS NOT NULL',
    'OFFSET',
    ' OR ',
    ' IN ',
    ' ON ',
    ' OVER ',
    'OUTER',
    'RETURNING',
    'RIGHT',
    'SELECT ',
    'SIMILAR TO',
    ' WHERE ',
  ];

  constructor(logging: boolean = false) {
    this.logging = logging;
  }

  logQuery(query: string, parameters?: any[]): any {
    if (this.logging)
      Logger.log(this.assembleQuery(query, false, parameters), this.stack);
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    _queryRunner?: QueryRunner,
  ) {
    const assembledQuery = this.assembleQuery(query, true, parameters);
    const message = `Failed with message: ${
      isObject(error) ? error?.message : error.slice(0, 1000)
    }`;

    Logger.error(assembledQuery + message);
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    _queryRunner?: QueryRunner,
  ): any {
    const assembledQuery = this.assembleQuery(query, true, parameters);
    const message = ` query is slow: ${time}`;

    Logger.warn(assembledQuery + message, this.stack);
  }

  logMigration(message: string, _queryRunner?: QueryRunner): any {
    if (this.logging) Logger.log(message, this.stack);
  }

  logSchemaBuild(_message: string, _queryRunner?: QueryRunner): any {}

  log(level: 'log' | 'info' | 'warn', message: string) {
    if (this.logging) {
      if (level === 'log') return Logger.log(message, this.stack);
      if (level === 'info') return Logger.debug(message, this.stack);
      if (level === 'warn') return Logger.warn(message, this.stack);
    }
  }

  private isParamExist(param: unknown) {
    return !isNil(param) ? (isArray(param) ? !isEmpty(param) : true) : false;
  }

  private assembleQuery(
    query: string,
    isError: boolean,
    parameters?: any[],
  ): string {
    const noColor =
      (!isNil(process?.env?.NO_COLOR) && process?.env?.NO_COLOR) || isError;

    const params = this.isParamExist(parameters)
      ? parameters
          ?.map((parameter, index) => `$${index + 1}: "${parameter}"`)
          .join(', ')
      : '';

    const coloredParams = this.isParamExist(parameters)
      ? noColor
        ? ` --PARAMETERS: ${params}`
        : ` --${this.colorCode.yellow}PARAMETERS: ${params}`
      : ' ';

    return noColor
      ? `${query}${coloredParams}`
      : `${this.colorCode.grey}${this.addBlueColor(
          this.addRedColor(query),
        )}${coloredParams}`;
  }

  private addBlueColor(query: string): string {
    return this.keywords.reduce(
      (acc, keyword) =>
        acc.replaceAll(
          keyword,
          `${this.colorCode.blue}${keyword}${this.colorCode.grey}`,
        ),
      query,
    );
  }

  private addRedColor(query: string): string {
    return this.transactionKeywords.reduce(
      (acc, keyword) =>
        acc.replaceAll(
          keyword,
          `${this.colorCode.cyan}${keyword}${this.colorCode.grey}`,
        ),
      query,
    );
  }
}
