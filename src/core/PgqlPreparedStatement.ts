import {
  JavaDateTimeFormatter,
  LocalDateTime,
  JavaLocalDateTime,
  JavaTimestamp,
} from './JavaStandardType'
import { JavaPgqlResultSet, PgqlResultSet } from './PgqlResultSet'
import { AutoClosable, AutoCloseableSync } from './Resource'
import javaNodeApi from './JavaApi'
import { PgqlError } from './PgqlError'
import { LOGGER } from './Logger'

export interface JavaPgqlPreparedStatement
  extends AutoClosable,
    AutoCloseableSync {
  getBatchSizeSync(): number
  getFetchSizeSync(): number
  getModifyCountSync(): number
  getResultSetSync(): JavaPgqlResultSet
  setBatchSizeSync(batchSize: number): void
  setFetchSizeSync(fetchSize: number): void

  cancel(): Promise<void>
  closeSync(): void
  close(): Promise<void>

  execute(): Promise<boolean>
  execute(
    parallel: number,
    dyanamicSampling: number,
    matchOptions: string,
    options: string,
  ): Promise<boolean>

  executeQuery(): Promise<JavaPgqlResultSet>
  executeQuery(
    timeout: number,
    parallel: number,
    dynamicSampling: number,
    maxResults: number,
    options: string,
  ): Promise<JavaPgqlResultSet>

  setBooleanSync(parameterIndex: number, x: boolean): void
  setDoubleSync(parameterIndex: number, x: number): void
  setFloatSync(parameterIndex: number, x: number): void
  setIntSync(parameterIndex: number, x: number): void
  setLongSync(parameterIndex: number, x: number): void
  setStringSync(parameterIndex: number, x: string): void
  setTimestampSync(parameterIndex: number, x: LocalDateTime): void
}

export class PgqlPreparedStatement implements AutoClosable, AutoCloseableSync {
  private static TIMESTAMP_FORMAT: string = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
  private readonly internalObj: JavaPgqlPreparedStatement
  private readonly pgql: string

  constructor(pstmt: JavaPgqlPreparedStatement, pgql: string) {
    this.internalObj = pstmt
    this.pgql = pgql
  }

  getBatchSize(): number {
    return this.internalObj.getBatchSizeSync()
  }

  getFetchSize(): number {
    return this.internalObj.getFetchSizeSync()
  }

  getModifyCount(): number {
    return this.internalObj.getModifyCountSync()
  }

  getResultSet(): PgqlResultSet {
    return new PgqlResultSet(this.internalObj.getResultSetSync())
  }

  setBatchSize(batchSize: number): void {
    this.internalObj.setBatchSizeSync(batchSize)
  }

  setFetchSize(fetchSize: number): void {
    this.internalObj.setFetchSizeSync(fetchSize)
  }

  async cancel(): Promise<void> {
    return this.internalObj.cancel().catch((error: Error) => {
      if (LOGGER.isErrorEnabledSync()) {
        LOGGER.errorSync(`PgqlPreparedStatement#cancel: ${error.message}`)
      }

      throw new PgqlError(error.message)
    })
  }

  closeSync(): void {
    return this.internalObj.closeSync()
  }

  async close(): Promise<void> {
    return this.internalObj.close().catch((error: Error) => {
      if (LOGGER.isErrorEnabledSync()) {
        LOGGER.errorSync(`PgqlPreparedStatement#close: ${error.message}`)
      }
      throw new PgqlError(error.message)
    })
  }

  async execute(): Promise<boolean> {
    return this.internalObj.execute().catch((error: Error) => {
      if (LOGGER.isErrorEnabledSync()) {
        LOGGER.errorSync(
          `PgqlPreparedStatement#execute:
                PGQL:
                    ${this.pgql}`,
        )
        LOGGER.errorSync(`PgqlPreparedStatement#execute: ${error.message}`)
      }
      throw new PgqlError(error.message)
    })
  }

  async executeWithOptions(
    parallel: number,
    dynamicSampling: number,
    matchOptions: string,
    options: string,
  ): Promise<boolean> {
    return this.internalObj
      .execute(parallel, dynamicSampling, matchOptions, options)
      .catch((error: Error) => {
        if (LOGGER.isErrorEnabledSync()) {
          LOGGER.errorSync(
            `PgqlPreparedStatement#executeWithOptions:
 parallel: ${parallel}
 dyanamicSampling: ${dynamicSampling}
 matchOptions: ${matchOptions}
 options: ${options}
 PGQL:
     ${this.pgql}`,
          )
          LOGGER.errorSync(
            `PgqlPreparedStatement#executeWithOptions: ${error.message}`,
          )
        }
        throw new PgqlError(error.message)
      })
  }

  async executeQuery(): Promise<PgqlResultSet> {
    const rs: JavaPgqlResultSet = await this.internalObj
      .executeQuery()
      .catch((error: Error) => {
        if (LOGGER.isErrorEnabledSync()) {
          LOGGER.errorSync(
            `PgqlPreparedStatement#executeQuery:
 PGQL:
     ${this.pgql}`,
          )

          LOGGER.errorSync(
            `PgqlPreparedStatement#executeQuery: ${error.message}`,
          )
        }
        throw new PgqlError(error.message)
      })

    return new PgqlResultSet(rs)
  }

  async executeQueryWithOptions(
    timeout: number,
    parallel: number,
    dynamicSampling: number,
    maxResults: number,
    options: string,
  ): Promise<PgqlResultSet> {
    const rs: JavaPgqlResultSet = await this.internalObj
      .executeQuery(timeout, parallel, dynamicSampling, maxResults, options)
      .catch((error: Error) => {
        if (LOGGER.isErrorEnabledSync()) {
          LOGGER.errorSync(
            `PgqlPreparedStatement#executeQueryWithOptions:
timeout: ${timeout}
parallel: ${parallel}
dyanamicSampling: ${dynamicSampling}
maxResults: ${maxResults}
options: ${options}
PGQL:
    ${this.pgql}`,
          )

          LOGGER.errorSync(
            `PgqlPreparedStatement#executeQueryWithOptions: ${error.message}`,
          )
        }
        throw new PgqlError(error.message)
      })

    return new PgqlResultSet(rs)
  }
  setBoolean(parameterIndex: number, x: boolean): void {
    this.internalObj.setBooleanSync(parameterIndex, x)
  }

  setDouble(parameterIndex: number, x: number): void {
    this.internalObj.setDoubleSync(parameterIndex, javaNodeApi.newDouble(x))
  }

  setFloat(parameterIndex: number, x: number): void {
    this.internalObj.setFloatSync(parameterIndex, javaNodeApi.newFloat(x))
  }

  setInt(parameterIndex: number, x: number): void {
    this.internalObj.setIntSync(parameterIndex, x)
  }

  setLong(parameterIndex: number, x: number): void {
    this.internalObj.setLongSync(parameterIndex, x)
  }

  setString(parameterIndex: number, x: string): void {
    this.internalObj.setStringSync(parameterIndex, x)
  }

  setTimestamp(parameterIndex: number, x: Date): void {
    const ldt: any = JavaLocalDateTime.parseSync(
      x.toISOString(),
      JavaDateTimeFormatter.ofPatternSync(
        PgqlPreparedStatement.TIMESTAMP_FORMAT,
      ),
    )

    this.internalObj.setTimestampSync(
      parameterIndex,
      JavaTimestamp.valueOfSync(ldt),
    )
  }
}
