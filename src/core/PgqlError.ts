import javaNodeApi from './JavaApi'

/**
 * @internal
 * @category core-api
 */
export const PgqlToSqlException: Error = javaNodeApi.import(
  'oracle.pg.rdbms.pgql.PgqlToSqlException',
)

/**
 * @category core-api
 */
export class PgqlError extends Error {
  constructor(message: string) {
    super(message)
  }
}
