import javaNodeApi from './JavaApi'
import { JavaOracleConnection, OracleConnection } from './Oracle'
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
    const pstmt: JavaPgqlPreparedStatement = await this.pgqlConn.prepareStatement(
      pgql,
    )
    return new PgqlPreparedStatement(pstmt)
  }

  async createStatement(): Promise<PgqlStatement> {
    const stmt: JavaPgqlStatement = await this.pgqlConn.createStatement()
    return new PgqlStatement(stmt)
  }
}
