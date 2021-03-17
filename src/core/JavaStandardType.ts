import javaNodeApi from './JavaApi'

export interface DateTimeFormatter {}

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

// Set UTC timezone
const JavaTimeZone = javaNodeApi.import('java.util.TimeZone')
JavaTimeZone.setDefaultSync(JavaTimeZone.getTimeZoneSync('UTC'))

/**
 * @internal
 * @category core-api
 */
export const JavaTimestamp = javaNodeApi.import('java.sql.Timestamp')

/**
 * @category core-api
 */
export class LocalDateTime {
  private static _cls: any = JavaLocalDateTime
  private static TIMESTAMP_FORMAT: string = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
  private static TIMESTAMP_FORMATTER = JavaDateTimeFormatter.ofPatternSync(
    LocalDateTime.TIMESTAMP_FORMAT,
  )

  private readonly internalObj: any

  static now(): LocalDateTime {
    return new LocalDateTime(LocalDateTime._cls.nowSync())
  }

  static parseWithFormat(text: string, format: string) {
    return new LocalDateTime(
      LocalDateTime._cls.parseSync(
        text,
        JavaDateTimeFormatter.ofPatternSync(format),
      ),
    )
  }

  static parseISOString(text: string): LocalDateTime {
    return new LocalDateTime(
      LocalDateTime._cls.parseSync(text, LocalDateTime.TIMESTAMP_FORMATTER),
    )
  }

  constructor(javaLocalDateTIme: any) {
    this.internalObj = javaLocalDateTIme
  }

  toRawObject(): any {
    return this.internalObj
  }

  getDayOfYear(): number {
    return this.internalObj.getDayOfYearSync()
  }

  toString(): string {
    return this.internalObj.toStringSync()
  }
}
