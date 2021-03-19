import { LocalDateTime } from './core/JavaStandardType'

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
  | 'object'

/**
 * TypeScript Type in PGQL
 *
 * @category wrapper-api
 */
type PgqlType = string | number | boolean | LocalDateTime | null

export { PgqlTypeName, PgqlType }
