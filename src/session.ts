import { PgqlConnection } from './core/PgqlConnection'
import { PgqlResultSet } from './core/PgqlResultSet'
import { AutoClosable, AutoCloseableSync } from './core/Resource'
import { Executor, IExecutor } from './executor'
import { IModifyOptions, IOptions, ISelectOptions } from './option'
import { IParameters } from './parameter'
import { IParameterHandler, ParemeterHandler } from './parameter-handler'
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
    selectOptions?: ISelectOptions,
  ): Promise<IResult>
  modify(
    pgql: string,
    parameters?: IParameters,
    options?: IOptions,
    selectOptions?: ISelectOptions,
    modifyOptions?: IModifyOptions,
  ): Promise<boolean>
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
    this.parameterHandler = new ParemeterHandler()
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
    selectOptions?: ISelectOptions,
  ): Promise<IResult> {
    const rs: PgqlResultSet = await this.executor.query(
      this.pgqlConn,
      pgql,
      this.parameterHandler,
      parameters,
      options,
      selectOptions,
    )

    try {
      const result: IResult = await this.resultHandler.handle(rs)
      return result
    } finally {
      rs.closeSync()
    }
  }

  /**
   * TBD: document comment
   */
  async modify(
    pgql: string,
    parameters?: IParameters,
    options?: IOptions,
    selectOptions?: ISelectOptions,
    modifyOptions?: IModifyOptions,
  ): Promise<boolean> {
    return this.executor.modify(
      this.pgqlConn,
      pgql,
      this.parameterHandler,
      parameters,
      options,
      selectOptions,
      modifyOptions,
    )
  }
}
