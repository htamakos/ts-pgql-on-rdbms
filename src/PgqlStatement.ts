import { JavaPgqlResultSet, PgqlResultSet } from './PgqlResultSet'
import { AutoClosable, AutoCloseableSync } from './Resource'

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

export class PgqlStatement implements AutoClosable, AutoCloseableSync {
  private readonly internalObj: JavaPgqlStatement

  constructor(readonly stmt: JavaPgqlStatement) {
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

  cancel(): Promise<void> {
    return this.internalObj.cancel()
  }

  closeSync(): void {
    return this.internalObj.closeSync()
  }

  async close(): Promise<void> {
    return this.internalObj.close()
  }

  async execute(pgql: string): Promise<boolean> {
    return this.internalObj.execute(pgql)
  }

  async executeWithOptions(
    pgql: string,
    parallel: number,
    dynamicSampling: number,
    matchOptions: string,
    options: string,
  ): Promise<boolean> {
    return this.internalObj.execute(
      pgql,
      parallel,
      dynamicSampling,
      matchOptions,
      options,
    )
  }

  async executeQuery(pgql: string): Promise<PgqlResultSet> {
    const rs: JavaPgqlResultSet = await this.internalObj.executeQuery(pgql)
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
    const rs = await this.internalObj.executeQuery(
      pgql,
      timeout,
      parallel,
      dynamicSampling,
      maxResults,
      options,
    )

    return new PgqlResultSet(rs)
  }
}
