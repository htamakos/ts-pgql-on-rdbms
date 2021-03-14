import javaNodeApi from './JavaApi'

export interface LocalDateTime {
  toStringSync(): string
}

export const JavaDateTimeFormatter = javaNodeApi.import(
  'java.time.format.DateTimeFormatter',
)
export const JavaLocalDateTime = javaNodeApi.import('java.time.LocalDateTime')
export const JavaTimestamp = javaNodeApi.import('java.sql.Timestamp')
