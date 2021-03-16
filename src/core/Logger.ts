import javaNodeApi from './JavaApi'

interface ILoggerFactory {
  getLoggerSync(name: string): ILogger
}

/**
 * @category core-api
 */
export interface ILogger {
  debugSync(msg: string): void
  infoSync(msg: string): void
  errorSync(msg: string): void
  warnSync(msg: string): void
  isInfoEnabledSync(): boolean
  isWarnEnabledSync(): boolean
  isDebugEnabledSync(): boolean
  isErrorEnabledSync(): boolean
}

const LoggerFactory: ILoggerFactory = javaNodeApi.import(
  'org.slf4j.LoggerFactory',
)

/**
 *
 * @category core-api
 */
export const LOGGER: ILogger = LoggerFactory.getLoggerSync('ts-pgql-on-rdbms')
