import javaNodeApi from './JavaApi'

/**
 * @category Core-api
 */
interface JavaPgDatatypeConstants {
  TYPE_DT_LONG: number
  TYPE_DT_STRING: number
  TYPE_DT_DOUBLE: number
  TYPE_DT_FLOAT: number
  TYPE_DT_INTEGER: number
  TYPE_DT_BOOL: number
  TYPE_DT_DATE: number
  TYPE_DT_EMPTY: number
}

/**
 *
 * @category core-api
 */
export const PgDatatypeConstants: JavaPgDatatypeConstants = javaNodeApi.import(
  'oracle.pg.rdbms.pgql.PgDatatypeConstants',
)
