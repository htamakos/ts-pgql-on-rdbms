import {
  OracleConfigBuilder,
  OracleConnection,
  OracleConnectionManager,
} from './core/Oracle'
import { PgqlConnection } from './core/PgqlConnection'
import { PgqlError } from './core/PgqlError'
import { AutoClosable, AutoCloseableSync } from './core/Resource'
import { LinkedQueue, IQueue } from './queue'
import { ISession, Session } from './session'

/**
 * TODO: document comment
 *
 * @category wrapper-api
 */
export interface IOraclePoolConfig {
  poolName: string
  initialPoolSize: number
  minPoolSize: number
  maxPoolSize: number
  timeoutCheckInteraval: number
  inactiveConnectionTimeout: number
}

/**
 * TODO: document comment
 *
 * @category wrapper-api
 */
export interface IOracleDatabaseConfig {
  readonly jdbcUrl: string
  readonly userName: string
  readonly password: string
  readonly databasePoolConfig?: IOraclePoolConfig
}

/**
 * TODO: document comment
 *
 * @category wrapper-api
 */
interface IPgqlDriver {
  readonly coreOracleConnectionManager: OracleConnectionManager
  getSession(): Promise<ISession>
}

/**
 * TBD: document comment
 *
 * @category wrapper-api
 */
export class Pgql implements IPgqlDriver, AutoClosable, AutoCloseableSync {
  private static instance?: Pgql = undefined
  private readonly _queue: IQueue<Session> = new LinkedQueue()

  readonly coreOracleConnectionManager: OracleConnectionManager

  private constructor(config: IOracleDatabaseConfig) {
    const configBuilder: OracleConfigBuilder = new OracleConfigBuilder()
      .url(config.jdbcUrl)
      .user(config.userName)
      .password(config.password)

    if (
      config.databasePoolConfig !== null &&
      config.databasePoolConfig !== undefined
    ) {
      configBuilder.inactiveConnectionTimeout(
        config.databasePoolConfig!.inactiveConnectionTimeout,
      )

      configBuilder.timeoutCheckInteraval(
        config.databasePoolConfig!.timeoutCheckInteraval,
      )

      configBuilder.poolName(config.databasePoolConfig!.poolName)
      configBuilder.initialPoolSize(config.databasePoolConfig!.initialPoolSize)
      configBuilder.minPoolSize(config.databasePoolConfig!.minPoolSize)
      configBuilder.maxPoolSize(config.databasePoolConfig!.maxPoolSize)
    }
    this.coreOracleConnectionManager = OracleConnectionManager.getInstance(
      configBuilder.build(),
    )
  }

  async getSession(): Promise<ISession> {
    let session: Session | null

    if ((session = this._queue.poll()) === null) {
      const conn: OracleConnection = await this.coreOracleConnectionManager
        .getConnection()
        .catch((error: Error) => {
          throw new PgqlError(error.message)
        })
      conn.setAutoCommit(false)
      const pgqlConn: PgqlConnection = PgqlConnection.getConnection(conn)
      const _session: Session = new Session(pgqlConn)
      this._queue.offer(_session)
      return _session
    }

    return session!
  }

  /**
   * TBD: document comment
   */
  static getInstance(config: IOracleDatabaseConfig) {
    if (Pgql.instance === undefined || Pgql.instance === null) {
      Pgql.instance = new Pgql(config)
    }

    return Pgql.instance
  }

  async close(): Promise<void> {
    for (const session of this._queue.values()) {
      await session.executor.close()

      const conn = session.pgqlConn.getJdbcConnection()
      if (!conn.isClosed()) {
        await session.pgqlConn.getJdbcConnection().close()
      }
    }
  }

  closeSync(): void {
    for (const session of this._queue.values()) {
      session.executor.closeSync()

      const conn = session.pgqlConn.getJdbcConnection()
      if (!conn.isClosed()) {
        session.pgqlConn.getJdbcConnection().closeSync()
      }
    }
  }
}
