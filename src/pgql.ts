import {
  OracleConfigBuilder,
  OracleConnection,
  OracleConnectionManager,
} from './core/Oracle'
import { PgqlConnection } from './core/PgqlConnection'
import { ISession, Session } from './session'

/**
 * TODO: document comment
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
 */
export interface IOracleDatabaseConfig {
  readonly jdbcUrl: string
  readonly userName: string
  readonly password: string
  readonly databasePoolConfig?: IOraclePoolConfig
}

/**
 * TODO: document comment
 */
interface IPgqlDriver {
  readonly coreOracleConnectionManager: OracleConnectionManager
  getSession(): Promise<ISession>
}

/**
 * TBD: document comment
 */
export class Pgql implements IPgqlDriver {
  private static instance?: Pgql = undefined

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
    // TODO: implements Session cache
    const conn: OracleConnection = await this.coreOracleConnectionManager.getConnection()
    conn.setAutoCommit(false)

    const pgqlConn: PgqlConnection = PgqlConnection.getConnection(conn)
    return new Session(pgqlConn)
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
}
