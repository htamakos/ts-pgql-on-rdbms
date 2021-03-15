import { OracleConnection } from './core/Oracle'
import { PgqlConnection } from './core/PgqlConnection'
import { AutoClosable, AutoCloseableSync } from './core/Resource'
import { Executor, IExecutor } from './executor'
import { IOptions } from './option'
import { IParameters } from './parameter'
import { IParameterHandler, ParameterHandler } from './parameter-handler'
import { IResult } from './result'
import { IResultHanlder, ResultHanlder } from './result-handler'

/**
 * TODO: document comment
 */
export interface ISession extends AutoClosable, AutoCloseableSync {
  readonly pgqlConn: PgqlConnection
  readonly parameterHandler: IParameterHandler
  readonly resultHandler: IResultHanlder
  query(
    pgql: string,
    parameters?: IParameters,
    options?: IOptions,
  ): Promise<IResult>
  modify(
    pgql: string,
    parameters?: IParameters,
    options?: IOptions,
  ): Promise<boolean>

  commit(): void
  rollback(): void
}

/**
 * TBD: document comment
 */
export class Session implements ISession {
  readonly pgqlConn: PgqlConnection
  readonly parameterHandler: IParameterHandler
  readonly resultHandler: IResultHanlder
  readonly executor: IExecutor

  constructor(pgqlConn: PgqlConnection) {
    this.pgqlConn = pgqlConn
    this.parameterHandler = new ParameterHandler()
    this.resultHandler = new ResultHanlder()
    this.executor = new Executor()
  }

  async close(): Promise<void> {
    // TODO: implements close PgqlPreparedStatement cache
    await this.pgqlConn.getJdbcConnection().close()
  }

  closeSync(): void {
    // TODO: implements close PgqlPreparedStatement cache
    this.pgqlConn.getJdbcConnection().closeSync()
  }

  /**
   * TBD: document comment
   */
  async query(
    pgql: string,
    parameters?: IParameters,
    options?: IOptions,
  ): Promise<IResult> {
    const result: IResult = await this.executor.query(
      this.pgqlConn,
      pgql,
      this.parameterHandler,
      this.resultHandler,
      parameters,
      options,
    )

    return result
  }

  /**
   * TBD: document comment
   */
  async modify(
    pgql: string,
    parameters?: IParameters,
    options?: IOptions,
  ): Promise<boolean> {
    return await this.executor.modify(
      this.pgqlConn,
      pgql,
      this.parameterHandler,
      parameters,
      options,
    )
  }

  commit(): void {
    const oraConn: OracleConnection = this.pgqlConn.getJdbcConnection()
    if (!oraConn.isClosed()) {
      oraConn.commit()
    }
  }

  rollback(): void {
    const oraConn: OracleConnection = this.pgqlConn.getJdbcConnection()
    if (!oraConn.isClosed()) {
      oraConn.rollback()
    }
  }
}
