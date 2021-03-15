import { PgqlConnection } from './core/PgqlConnection'
import { PgqlPreparedStatement } from './core/PgqlPreparedStatement'
import { PgqlResultSet } from './core/PgqlResultSet'
import { DEFAULT_OPTIONS, IOptions } from './option'
import { IParameters } from './parameter'
import { IParameterHandler } from './parameter-handler'
import { IResult } from './result'
import { IResultHanlder } from './result-handler'

/**
 * TODO: document comment
 */
export interface IExecutor {
  /**
   * TODO: document comment
   */
  query(
    pgqlConn: PgqlConnection,
    pgql: string,
    parameterHandler: IParameterHandler,
    resultHandler: IResultHanlder,
    parameters?: IParameters,
    options?: IOptions,
  ): Promise<IResult>

  /**
   * TODO: document comment
   */
  modify(
    pgqlConn: PgqlConnection,
    pgql: string,
    parameterHandler: IParameterHandler,
    parameters?: IParameters,
    options?: IOptions,
  ): Promise<boolean>
}

/**
 * TODO: document comment
 */
export class Executor implements IExecutor {
  /**
   * TODO: document comment
   */
  async query(
    pgqlConn: PgqlConnection,
    pgql: string,
    parameterHandler: IParameterHandler,
    resultHandler: IResultHanlder,
    parameters?: IParameters,
    options?: IOptions,
  ): Promise<IResult> {
    // TODO: implements PreparedStatement cache
    const pstmt: PgqlPreparedStatement = await pgqlConn.prepareStatement(pgql)
    let rs: PgqlResultSet | undefined = undefined
    try {
      parameterHandler.setParameters(pstmt, parameters)
      if (options !== undefined) {
        rs = await pstmt.executeQueryWithOptions(
          options.timeout,
          options.parallel,
          options.dynamicSampling,
          options.maxResults,
          '',
        )
      } else {
        rs = await pstmt.executeQuery()
      }

      return await resultHandler.handle(rs)
    } finally {
      if (rs !== undefined && rs !== null) {
        rs.closeSync()
      }
      if (pstmt !== undefined && pstmt !== null) {
        pstmt.closeSync()
      }
    }
  }

  /**
   * TODO: document comment
   */
  async modify(
    pgqlConn: PgqlConnection,
    pgql: string,
    parameterHandler: IParameterHandler,
    parameters?: IParameters,
    options?: IOptions,
  ): Promise<boolean> {
    // TODO: implements PreparedStatement cache
    const pstmt: PgqlPreparedStatement = await pgqlConn.prepareStatement(pgql)

    try {
      parameterHandler.setParameters(pstmt, parameters)

      const _options: IOptions =
        options !== undefined ? options! : DEFAULT_OPTIONS

      return await pstmt.executeWithOptions(
        _options.parallel,
        _options.dynamicSampling,
        '',
        'AUTO_COMMIT=F',
      )
    } finally {
      if (pstmt !== undefined && pstmt !== null) {
        pstmt.closeSync()
      }
    }
  }
}
