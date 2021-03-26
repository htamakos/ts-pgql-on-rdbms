import { OracleConnection } from './core/Oracle'
import { PgqlConnection } from './core/PgqlConnection'
import { PgqlError } from './core/PgqlError'
import { AutoClosable, AutoCloseableSync } from './core/Resource'
import {
  SimpleExecutor,
  ReuseExecutor,
  ExecutorType,
  DEFAULT_EXECUTOR_TYPE,
  IExecutor,
} from './executor'
import { IOptions } from './option'
import { IParameters } from './parameter'
import { IParameterHandler, ParameterHandler } from './parameter-handler'
import { IResult } from './result'
import { IResultHanlder, ResultHanlder } from './result-handler'

/**
 * TODO: document comment
 *
 * @category wrapper-api
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
 *
 * @internal
 * @category wrapper-api
 */
export class Session implements ISession {
  readonly pgqlConn: PgqlConnection
  readonly parameterHandler: IParameterHandler
  readonly resultHandler: IResultHanlder
  readonly executor: IExecutor

  constructor(
    pgqlConn: PgqlConnection,
    executorType: ExecutorType = DEFAULT_EXECUTOR_TYPE,
  ) {
    this.pgqlConn = pgqlConn
    this.parameterHandler = new ParameterHandler()
    this.resultHandler = new ResultHanlder()

    switch (executorType) {
      case 'REUSE':
        this.executor = new ReuseExecutor(pgqlConn)
        break
      case 'SIMPLE':
        this.executor = new SimpleExecutor(pgqlConn)
        break
      default:
        throw new PgqlError(`unknown ExecutorType: ${executorType}`)
    }
  }

  async close(): Promise<void> {
    // noop
  }

  closeSync(): void {
    // noop
  }

  /**
   * TBD: document comment
   */
  async query(
    pgql: string,
    parameters?: IParameters,
    options?: IOptions,
  ): Promise<IResult> {
    const result: IResult = await this.executor
      .query(
        pgql,
        this.parameterHandler,
        this.resultHandler,
        parameters,
        options,
      )
      .catch((error: Error) => {
        throw new PgqlError(error.message)
      })

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
    return await this.executor
      .modify(pgql, this.parameterHandler, parameters, options)
      .catch((error: Error) => {
        throw new PgqlError(error.message)
      })
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
