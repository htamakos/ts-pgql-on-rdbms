import { LOGGER } from './Logger'
import { PgqlError } from './PgqlError'
import { JavaPgqlResultSet, PgqlResultSet } from './PgqlResultSet'
import { AutoClosable, AutoCloseableSync } from './Resource'

/**
 * @internal
 * @category core-api
 */
export interface JavaPgqlStatement extends AutoClosable, AutoCloseableSync {
  getBatchSizeSync(): number
  getFetchSizeSync(): number
  getModifyCountSync(): number
  getResultSetSync(): JavaPgqlResultSet
  setBatchSizeSync(batchSize: number): void
  setFetchSizeSync(fetchSize: number): void

  cancel(): Promise<void>
  closeSync(): void
  close(): Promise<void>

  execute(pgql: string): Promise<boolean>
  execute(
    pgql: string,
    parallel: number,
    dyanamicSampling: number,
    matchOptions: string,
    options: string,
  ): Promise<boolean>

  executeQuery(pgql: string): Promise<JavaPgqlResultSet>
  executeQuery(
    pgql: string,
    timeout: number,
    parallel: number,
    dynamicSampling: number,
    maxResults: number,
    options: string,
  ): Promise<JavaPgqlResultSet>
}

/**
 * @category core-api
 */
export class PgqlStatement implements AutoClosable, AutoCloseableSync {
  private readonly internalObj: JavaPgqlStatement

  constructor(stmt: JavaPgqlStatement) {
    this.internalObj = stmt
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
      throw new PgqlError(error.message)
    })
  }

  closeSync(): void {
    return this.internalObj.closeSync()
  }

  async close(): Promise<void> {
    return this.internalObj.close().catch((error: Error) => {
      throw new PgqlError(error.message)
    })
  }

  async execute(pgql: string): Promise<boolean> {
    return this.internalObj.execute(pgql).catch((error: Error) => {
      if (LOGGER.isErrorEnabledSync()) {
        LOGGER.errorSync(
          `PgqlStatement#executeWithOptions:
PGQL:
    ${pgql}
              `,
        )

        LOGGER.errorSync(`PgqlStatement#execute: ${error.message}`)
      }

      throw new PgqlError(error.message)
    })
  }

  async executeWithOptions(
    pgql: string,
    parallel: number,
    dynamicSampling: number,
    matchOptions: string,
    options: string,
  ): Promise<boolean> {
    return this.internalObj
      .execute(pgql, parallel, dynamicSampling, matchOptions, options)
      .catch((error: Error) => {
        if (LOGGER.isErrorEnabledSync()) {
          LOGGER.errorSync(
            `PgqlStatement#executeWithOptions:
parallel: ${parallel}
dynamicSampling: ${dynamicSampling}
matchOptions: ${matchOptions}
options: ${options}
PGQL:
    ${pgql}
              `,
          )
          LOGGER.errorSync(`PgqlStatement#executeWithOptions: ${error.message}`)
        }

        throw new PgqlError(error.message)
      })
  }

  async executeQuery(pgql: string): Promise<PgqlResultSet> {
    const rs: JavaPgqlResultSet = await this.internalObj
      .executeQuery(pgql)
      .catch((error: Error) => {
        if (LOGGER.isErrorEnabledSync()) {
          LOGGER.errorSync(
            `PgqlStatement#executeQuery:
PGQL:
    ${pgql}
              `,
          )

          LOGGER.errorSync(`PgqlStatement#executeQuery: ${error.message}`)
        }

        throw new PgqlError(error.message)
      })

    return new PgqlResultSet(rs)
  }

  async executeQueryWithOptions(
    pgql: string,
    timeout: number,
    parallel: number,
    dynamicSampling: number,
    maxResults: number,
    options: string,
  ): Promise<PgqlResultSet> {
    const rs = await this.internalObj
      .executeQuery(
        pgql,
        timeout,
        parallel,
        dynamicSampling,
        maxResults,
        options,
      )
      .catch((error: Error) => {
        if (LOGGER.isErrorEnabledSync()) {
          LOGGER.errorSync(
            `PgqlStatement#executeQueryWithOptions:
timeout: ${timeout}
parallel: ${parallel}
dynamicSampling: ${dynamicSampling}
maxResults: ${maxResults}
options: ${options}
PGQL:
    ${pgql}
              `,
          )
          LOGGER.errorSync(
            `PgqlStatement#executeQueryWithOptions: ${error.message}`,
          )
        }

        throw new PgqlError(error.message)
      })

    return new PgqlResultSet(rs)
  }
}
