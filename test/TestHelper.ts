import * as pgql from '../src/pgql'
import {
  OracleConnection,
  OracleConfig,
  OracleConfigBuilder,
  OracleConnectionManager,
} from '../src/core/Oracle'
import { PgqlConnection } from '../src/core/PgqlConnection'
import { PgqlPreparedStatement } from '../src/core/PgqlPreparedStatement'
import { PgqlStatement } from '../src/core/PgqlStatement'
import { tryWith } from '../src/core/Resource'

const testDbConfig: OracleConfig = new OracleConfigBuilder()
  .url(process.env.TEST_JDBC_URL || 'jdbc:oracle:thin:@localhost:21521/pdb1')
  .user(process.env.TEST_DB_USER || 'test_user')
  .password(process.env.TEST_DB_PASSWORD || 'welcome1')
  .build()

const oraclePoolConfig: pgql.IOraclePoolConfig = {
  poolName: 'pool2',
  initialPoolSize: 4,
  minPoolSize: 4,
  maxPoolSize: 4,
  timeoutCheckInteraval: 5,
  inactiveConnectionTimeout: 60,
}

export const oracleDatabaseConfig: pgql.IOracleDatabaseConfig = {
  jdbcUrl: testDbConfig.url,
  userName: testDbConfig.user,
  password: testDbConfig.password,
  databasePoolConfig: oraclePoolConfig,
}

export const connManager: OracleConnectionManager = OracleConnectionManager.getInstance(
  testDbConfig,
)

export async function createGraph(graphName: string): Promise<void> {
  const conn: OracleConnection = await connManager.getConnection()
  conn.setAutoCommit(false)

  await tryWith(conn, async (conn: OracleConnection) => {
    // create PGQL Connection
    const pgqlConn: PgqlConnection = PgqlConnection.getConnection(conn)
    const stmt: PgqlStatement = await pgqlConn.createStatement()

    // create a Graph for test
    await tryWith(stmt, async (stmt: PgqlStatement) => {
      await stmt.execute(`
        CREATE PROPERTY GRAPH ${graphName}
      `)
    })

    // For prevent occuring bag related to TTP with PARALLEL
    const pgSchemaIndexNamePostfixes: string[] = [
      'XDE$',
      'XDG$',
      'XQD$',
      'XQE$',
      'XQG$',
      'XQV$',
      'XSE$',
      'XSG$',
    ]

    pgSchemaIndexNamePostfixes.forEach(async (postFix) => {
      await conn.executeStatement(`
        ALTER INDEX ${graphName}${postFix} noparallel
      `)
    })

    // insert Data
    const insertPstmt: PgqlPreparedStatement = await pgqlConn.prepareStatement(`
      INSERT INTO ${graphName}
        VERTEX v1 LABELS(VL)
            PROPERTIES(
                v1.STR_PROP = 'hoge',
                v1.INT_PROP = CAST (1 as integer),
                v1.LONG_PROP = CAST (10000 as long),
                v1.FLOAT_PROP = CAST (0.01 as float),
                v1.DOUBLE_PROP = CAST (0.1 as double),
                v1.BOOLEAN_PROP = false,
                v1.TIMESTAMP_PROP = timestamp '2021-03-12 10:00:00'
            ),
        VERTEX v2 LABELS(VL2)
            PROPERTIES(
                v2.STR_PROP = 'hoge2',
                v2.INT_PROP = CAST (2 as integer),
                v2.LONG_PROP = CAST (20000 as long),
                v2.FLOAT_PROP = CAST (0.02 as float),
                v2.DOUBLE_PROP = CAST (0.2 as double),
                v2.BOOLEAN_PROP = true,
                v2.TIMESTAMP_PROP = timestamp '2021-03-13 10:00:00'
            ),
        EDGE e BETWEEN v1 and v2 LABELS(EL)
            PROPERTIES(
                e.STR_PROP = 'hoge3',
                e.INT_PROP = CAST (3 as integer),
                e.LONG_PROP = CAST (30000 as long),
                e.FLOAT_PROP = CAST (0.03 as float),
                e.DOUBLE_PROP = CAST (0.3 as double),
                e.BOOLEAN_PROP = true,
                e.TIMESTAMP_PROP = timestamp '2021-03-14 10:00:00'
            )
    `)
    await tryWith(insertPstmt, async (insertPstmt: PgqlPreparedStatement) => {
      const parallelDop = 0
      const dynamicSamplingLevel = 2
      const matchOptions = ''
      const options = ''

      // test data
      await insertPstmt.executeWithOptions(
        parallelDop,
        dynamicSamplingLevel,
        matchOptions,
        options,
      )
    })
  })
}

export async function dropGraph(graphName: string): Promise<void> {
  const conn: OracleConnection = await connManager.getConnection()
  conn.setAutoCommit(false)

  await tryWith(conn, async (conn: OracleConnection) => {
    // create PGQL Connection
    const pgqlConn: PgqlConnection = PgqlConnection.getConnection(conn)
    // drop a Graph for test
    const dropStmt: PgqlStatement = await pgqlConn.createStatement()
    await tryWith(dropStmt, async (dropStmt: PgqlStatement) => {
      await dropStmt.execute(`
          DROP PROPERTY GRAPH ${graphName}
        `)
    })
  })
}

export async function executeQueryTest(
  func: (pgqlConn: PgqlConnection) => Promise<void>,
) {
  const conn: OracleConnection = await connManager.getConnection()
  conn.setAutoCommit(false)

  await tryWith(conn, async (conn: OracleConnection) => {
    // create PGQL Connection
    const pgqlConn: PgqlConnection = PgqlConnection.getConnection(conn)
    await func(pgqlConn)
  })
}
