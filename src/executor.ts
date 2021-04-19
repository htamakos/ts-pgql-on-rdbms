import { ICache, SimpleLruCache } from './cache'
import { PgqlConnection } from './core/PgqlConnection'
import { PgqlError } from './core/PgqlError'
import { PgqlPreparedStatement } from './core/PgqlPreparedStatement'
import { PgqlResultSet } from './core/PgqlResultSet'
import { AutoClosable, AutoCloseableSync } from './core/Resource'
import { DEFAULT_OPTIONS, IOptions } from './option'
import { IParameters } from './parameter'
import { IParameterHandler } from './parameter-handler'
import { IResult } from './result'
import { IResultHanlder } from './result-handler'

/**
 * TODO: document comment
 *
 * @category wrapper-api
 */
export interface IExecutor extends AutoClosable, AutoCloseableSync {
  readonly pgqlConn: PgqlConnection

  /**
   * TODO: document comment
   */
  query(
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
    pgql: string,
    parameterHandler: IParameterHandler,
    parameters?: IParameters,
    options?: IOptions,
  ): Promise<boolean>
}

/**
 * TODO: document comment
 */
abstract class AbstractExecutor
  implements IExecutor, AutoClosable, AutoCloseableSync {
  readonly pgqlConn: PgqlConnection

  abstract getPreparedStatement(pgql: string): Promise<PgqlPreparedStatement>
  abstract closePrepareStatement(pstmt: PgqlPreparedStatement): void
  abstract getCacheSize(): number

  constructor(pgqlConn: PgqlConnection) {
    this.pgqlConn = pgqlConn
  }

  /**
   * TODO: document comment
   */
  async query(
    pgql: string,
    parameterHandler: IParameterHandler,
    resultHandler: IResultHanlder,
    parameters?: IParameters,
    options?: IOptions,
  ): Promise<IResult> {
    // TODO: implements PreparedStatement cache
    const pstmt: PgqlPreparedStatement = await this.getPreparedStatement(pgql)
    let rs: PgqlResultSet | undefined = undefined
    try {
      parameterHandler.setParameters(pstmt, parameters)
      if (options !== undefined) {
        rs = await pstmt
          .executeQueryWithOptions(
            options.timeout,
            options.parallel,
            options.dynamicSampling,
            options.maxResults,
            options.queryOptionString !== undefined
              ? options.queryOptionString!
              : '',
          )
          .catch((error: Error) => {
            throw new PgqlError(error.message)
          })
      } else {
        rs = await pstmt.executeQuery().catch((error: Error) => {
          throw new PgqlError(error.message)
        })
      }

      return await resultHandler.handle(rs)
    } finally {
      if (rs !== undefined && rs !== null) {
        rs.closeSync()
      }
      if (pstmt !== undefined && pstmt !== null) {
        this.closePrepareStatement(pstmt)
      }
    }
  }

  /**
   * TODO: document comment
   */
  async modify(
    pgql: string,
    parameterHandler: IParameterHandler,
    parameters?: IParameters,
    options?: IOptions,
  ): Promise<boolean> {
    const pstmt: PgqlPreparedStatement = await this.getPreparedStatement(pgql)

    try {
      parameterHandler.setParameters(pstmt, parameters)

      const _options: IOptions =
        options !== undefined ? options! : DEFAULT_OPTIONS

      return await pstmt
        .executeWithOptions(
          _options.parallel,
          _options.dynamicSampling,
          _options.queryOptionString !== undefined
            ? _options.queryOptionString!
            : '',
          'AUTO_COMMIT=F',
        )
        .catch((error: Error) => {
          throw new PgqlError(error.message)
        })
    } finally {
      if (pstmt !== undefined && pstmt !== null) {
        this.closePrepareStatement(pstmt)
      }
    }
  }

  abstract close(): Promise<void>
  abstract closeSync(): void
}

/**
 * TODO: document comment
 *
 * @internal
 * @category wrapper-api
 *
 */
export class SimpleExecutor extends AbstractExecutor {
  async getPreparedStatement(pgql: string): Promise<PgqlPreparedStatement> {
    return this.pgqlConn.prepareStatement(pgql)
  }

  closePrepareStatement(pstmt: PgqlPreparedStatement): void {
    pstmt.closeSync()
  }

  async close(): Promise<void> {
    // noop
  }

  closeSync(): void {
    // noop
  }

  getCacheSize(): number {
    return 0
  }
}

/**
 * TODO: document comment
 *
 * @internal
 * @category wrapper-api
 *
 */
export class ReuseExecutor extends AbstractExecutor {
  readonly _cache: ICache<PgqlPreparedStatement> = new SimpleLruCache<PgqlPreparedStatement>()

  async getPreparedStatement(pgql: string): Promise<PgqlPreparedStatement> {
    const pstmt: PgqlPreparedStatement = this._cache.hasKey(pgql)
      ? this._cache.get(pgql)!
      : await this.pgqlConn.prepareStatement(pgql)

    return pstmt
  }

  closePrepareStatement(pstmt: PgqlPreparedStatement) {
    // Store PreparedStatement to cache due to reuse
    this._cache.set(pstmt.getPgqlStatement(), pstmt)
  }

  async close(): Promise<void> {
    for (const v of this._cache.values()) {
      await v.close()
    }

    this._cache.clear()
  }

  closeSync(): void {
    for (const v of this._cache.values()) {
      v.closeSync()
    }

    this._cache.clear()
  }

  getCacheSize(): number {
    return this._cache.size()
  }
}

/**
 * @internal
 * @category wrapper-api
 */
export type ExecutorType = 'SIMPLE' | 'REUSE'

/**
 * @internal
 * @category wrapper-api
 */
export const DEFAULT_EXECUTOR_TYPE: ExecutorType = 'REUSE'
