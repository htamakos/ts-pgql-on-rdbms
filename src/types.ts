/**
 * Type name in PGQL on RDBMS
 *
 * @internal
 * @category wrapper-api
 */
type PgqlTypeName =
  | 'string'
  | 'int'
  | 'long'
  | 'float'
  | 'double'
  | 'boolean'
  | 'timestamp'

/**
 * TypeScript Type in PGQL
 *
 * @category wrapper-api
 */
type PgqlType = string | number | boolean | Date | null

export { PgqlTypeName, PgqlType }
