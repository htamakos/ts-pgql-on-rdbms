import javaNodeApi from './JavaApi'

/**
 * @internal
 * @category core-api
 */
export interface LocalDateTime {
  toStringSync(): string
}

/**
 * @internal
 * @category core-api
 */
export const JavaDateTimeFormatter = javaNodeApi.import(
  'java.time.format.DateTimeFormatter',
)

/**
 * @internal
 * @category core-api
 */
export const JavaLocalDateTime = javaNodeApi.import('java.time.LocalDateTime')

/**
 * @internal
 * @category core-api
 */
export const JavaTimestamp = javaNodeApi.import('java.sql.Timestamp')
