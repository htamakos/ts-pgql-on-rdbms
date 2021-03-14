import javaNodeApi from './JavaApi'
import { AutoClosable, AutoCloseableSync } from './Resource'

const PoolDataSourceFactory = javaNodeApi.import(
  'oracle.ucp.jdbc.PoolDataSourceFactory',
)

export interface JavaOracleConnection extends AutoClosable, AutoCloseableSync {
  closeSync(): void
  close(): Promise<void>
  isClosedSync(): boolean
  getAutoCommitSync(): boolean
  setAutoCommitSync(autoCommit: boolean): void
  createStatementSync(): any
  commitSync(): void
  rollbackSync(): void
}

export class OracleConnection implements AutoClosable, AutoCloseableSync {
  private readonly internalObj: JavaOracleConnection

  constructor(readonly conn: JavaOracleConnection) {
    this.internalObj = conn
  }

  getRawConnection(): JavaOracleConnection {
    return this.internalObj
  }

  closeSync(): void {
    this.internalObj.closeSync()
  }

  async close(): Promise<void> {
    return this.internalObj.close()
  }

  isClosed(): boolean {
    return this.internalObj.isClosedSync()
  }

  getAutoCommit(): boolean {
    return this.internalObj.getAutoCommitSync()
  }

  setAutoCommit(autoCommit: boolean): void {
    this.internalObj.setAutoCommitSync(autoCommit)
  }

  commit(): void {
    this.internalObj.commitSync()
  }

  rollback(): void {
    this.internalObj.rollbackSync()
  }

  async executeStatement(sql: string): Promise<void> {
    const stmt = this.internalObj.createStatementSync()
    try {
      await stmt.execute(sql)
    } finally {
      await stmt.closeSync()
    }
  }
}

interface IPoolDataSource {
  getConnection(): Promise<JavaOracleConnection>
  setConnectionFactoryClassNameSync(factoryClassName: string): void
  setURLSync(url: string): void
  setUserSync(user: string): void
  setPasswordSync(password: string): void
  setConnectionPoolNameSync(poolName: string): void
  setInitialPoolSizeSync(initialPoolSize: number): void
  setMinPoolSizeSync(minPoolSize: number): void
  setMaxPoolSizeSync(maxPoolSize: number): void
  setTimeoutCheckIntervalSync(timeoutCheckInteraval: number): void
  setInactiveConnectionTimeoutSync(inactiveConnectionTimeout: number): void
}

export interface OracleConfig {
  url: string
  user: string
  password: string
  poolName: string
  initialPoolSize: number
  minPoolSize: number
  maxPoolSize: number
  timeoutCheckInteraval: number
  inactiveConnectionTimeout: number
}

export class OracleConfigBuilder {
  private readonly _config: OracleConfig

  constructor() {
    this._config = {
      url: '',
      user: '',
      password: '',
      poolName: 'pool1',
      initialPoolSize: 1,
      minPoolSize: 1,
      maxPoolSize: 1,
      timeoutCheckInteraval: 5,
      inactiveConnectionTimeout: 10,
    }
  }

  url(url: string): OracleConfigBuilder {
    this._config.url = url
    return this
  }

  user(user: string): OracleConfigBuilder {
    this._config.user = user
    return this
  }

  password(password: string): OracleConfigBuilder {
    this._config.password = password
    return this
  }

  poolName(poolName: string): OracleConfigBuilder {
    this._config.poolName = poolName
    return this
  }

  initialPoolSize(initialPoolSize: number): OracleConfigBuilder {
    this._config.initialPoolSize = initialPoolSize
    return this
  }

  minPoolSize(minPoolSize: number): OracleConfigBuilder {
    this._config.minPoolSize = minPoolSize
    return this
  }

  maxPoolSize(maxPoolSize: number): OracleConfigBuilder {
    this._config.maxPoolSize = maxPoolSize
    return this
  }

  timeoutCheckInteraval(timeoutCheckInteraval: number) {
    this._config.timeoutCheckInteraval = timeoutCheckInteraval
    return this
  }

  inactiveConnectionTimeout(inactiveConnectionTimeout: number) {
    this._config.inactiveConnectionTimeout = inactiveConnectionTimeout
    return this
  }

  build(): OracleConfig {
    return this._config
  }
}

export class OracleConnectionManager {
  static CONN_FACTORY_CLASS_NAME: string = 'oracle.jdbc.pool.OracleDataSource'
  private pool: IPoolDataSource
  private static instance: OracleConnectionManager

  private constructor(config: OracleConfig) {
    this.pool = PoolDataSourceFactory.getPoolDataSourceSync()

    this.pool.setUserSync(config.user)
    this.pool.setPasswordSync(config.password)
    this.pool.setURLSync(config.url)
    this.pool.setConnectionFactoryClassNameSync(
      OracleConnectionManager.CONN_FACTORY_CLASS_NAME,
    )
    this.pool.setConnectionPoolNameSync(config.poolName)
    this.pool.setInitialPoolSizeSync(config.initialPoolSize)
    this.pool.setMinPoolSizeSync(config.minPoolSize)
    this.pool.setMaxPoolSizeSync(config.maxPoolSize)
    this.pool.setInactiveConnectionTimeoutSync(config.inactiveConnectionTimeout)
    this.pool.setTimeoutCheckIntervalSync(config.timeoutCheckInteraval)
  }

  static getInstance(config: OracleConfig): OracleConnectionManager {
    if (!this.instance) {
      return new OracleConnectionManager(config)
    }

    return this.instance
  }

  async getConnection(): Promise<OracleConnection> {
    const conn: JavaOracleConnection = await this.pool.getConnection()
    return new OracleConnection(conn)
  }
}
