import javaNodeApi from './JavaApi'
import { LOGGER } from './Logger'
import { JavaOracleConnection, OracleConnection } from './Oracle'
import { PgqlError } from './PgqlError'
import {
  JavaPgqlPreparedStatement,
  PgqlPreparedStatement,
} from './PgqlPreparedStatement'
import { JavaPgqlStatement, PgqlStatement } from './PgqlStatement'

const javaPgqlConnection = javaNodeApi.import(
  'oracle.pg.rdbms.pgql.PgqlConnection',
)

export interface JavaPgqlConnection {
  getGraphSync(): string
  setGraphSync(graph: string): void
  getSchemaSync(): string
  setSchemaSync(schema: string): void
  getJdbcConnectionSync(): JavaOracleConnection
  prepareStatement(pgql: string): Promise<JavaPgqlPreparedStatement>
  createStatement(): Promise<JavaPgqlStatement>
}

export class PgqlConnection {
  private readonly pgqlConn: JavaPgqlConnection

  private constructor(connection: OracleConnection) {
    this.pgqlConn = javaPgqlConnection.getConnectionSync(
      connection.getRawConnection(),
    )
  }

  static getConnection(connection: OracleConnection): PgqlConnection {
    const pgqlConn = new PgqlConnection(connection)
    return pgqlConn
  }

  getGraph(): string {
    return this.pgqlConn.getGraphSync()
  }

  getJdbcConnection(): OracleConnection {
    return new OracleConnection(this.pgqlConn.getJdbcConnectionSync())
  }

  getSchema(): string {
    return this.pgqlConn.getSchemaSync()
  }

  setGraph(graph: string): void {
    this.pgqlConn.setGraphSync(graph)
  }

  setSchema(schema: string): void {
    this.pgqlConn.setSchemaSync(schema)
  }

  async prepareStatement(pgql: string): Promise<PgqlPreparedStatement> {
    const pstmt: JavaPgqlPreparedStatement = await this.pgqlConn
      .prepareStatement(pgql)
      .catch((error: Error) => {
        if (LOGGER.isErrorEnabledSync()) {
          LOGGER.errorSync(
            `PgqlConnection#prepareStatement:
PGQL:
    ${pgql}
            `,
          )
          LOGGER.errorSync(`PgqlConnection#prepareStatement: ${error.message}`)
        }
        throw new PgqlError(error.message)
      })

    return new PgqlPreparedStatement(pstmt, pgql)
  }

  async createStatement(): Promise<PgqlStatement> {
    const stmt: JavaPgqlStatement = await this.pgqlConn
      .createStatement()
      .catch((error: Error) => {
        if (LOGGER.isErrorEnabledSync()) {
          LOGGER.errorSync(`PgqlConnection#createStatement: ${error.message}`)
        }

        throw new PgqlError(error.message)
      })

    return new PgqlStatement(stmt)
  }
}
