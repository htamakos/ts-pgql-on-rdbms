/**
 * TODO: document comment
 */
// Type name in PGQL on RDBMS
type PgqlTypeName =
  | 'string'
  | 'int'
  | 'long'
  | 'float'
  | 'double'
  | 'boolean'
  | 'timestamp'

/**
 * TODO: document comment
 */
// TypeScript Type in PGQL
type PgqlType = string | number | boolean | Date | null

export { PgqlTypeName, PgqlType }
