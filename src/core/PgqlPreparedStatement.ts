import {
  JavaDateTimeFormatter,
  LocalDateTime,
  JavaLocalDateTime,
  JavaTimestamp,
} from './JavaStandardType'
import { JavaPgqlResultSet, PgqlResultSet } from './PgqlResultSet'
import { AutoClosable, AutoCloseableSync } from './Resource'
import javaNodeApi from './JavaApi'

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

  constructor(pstmt: JavaPgqlPreparedStatement) {
    this.internalObj = pstmt
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

  async execute(): Promise<boolean> {
    return this.internalObj.execute()
  }

  async executeWithOptions(
    parallel: number,
    dynamicSampling: number,
    matchOptions: string,
    options: string,
  ): Promise<boolean> {
    return this.internalObj.execute(
      parallel,
      dynamicSampling,
      matchOptions,
      options,
    )
  }

  async executeQuery(): Promise<PgqlResultSet> {
    const rs: JavaPgqlResultSet = await this.internalObj.executeQuery()
    return new PgqlResultSet(rs)
  }

  async executeQueryWithOptions(
    timeout: number,
    parallel: number,
    dynamicSampling: number,
    maxResults: number,
    options: string,
  ): Promise<PgqlResultSet> {
    const rs: JavaPgqlResultSet = await this.internalObj.executeQuery(
      timeout,
      parallel,
      dynamicSampling,
      maxResults,
      options,
    )

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
