import javaNodeApi from './JavaApi'

export const PgqlToSqlException: Error = javaNodeApi.import(
  'oracle.pg.rdbms.pgql.PgqlToSqlException',
)

export class PgqlError extends Error {
  constructor(message: string) {
    super(message)
  }
}
