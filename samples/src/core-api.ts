import * as pgql from 'ts-pgql-on-rdbms'

const dbConfig: pgql.OracleConfig = new pgql.OracleConfigBuilder()
  .url(process.env.TEST_JDBC_URL || 'jdbc:oracle:thin:@localhost:21521/pdb1')
  .user(process.env.TEST_DB_USER || 'test_user')
  .password(process.env.TEST_DB_PASSWORD || 'welcome1')
  .poolName('test-core-api1')
  .build()

const connManager: pgql.OracleConnectionManager = pgql.OracleConnectionManager.getInstance(
  dbConfig,
)

export async function executePgqlByCoreAPI() {
  const conn = await connManager.getConnection()
  conn.setAutoCommit(false)

  try {
    await pgql.tryWith(conn, async (conn: pgql.OracleConnection) => {
      const pgqlConn: pgql.PgqlConnection = pgql.PgqlConnection.getConnection(
        conn,
      )

      // Insert Data
      const insertPstmt: pgql.PgqlPreparedStatement = await pgqlConn.prepareStatement(`
        INSERT INTO test_graph
          VERTEX v LABELS(vl) PROPERTIES(v.LONG_PROP = ?)
      `)

      await pgql.tryWith(
        insertPstmt,
        async (pstmt: pgql.PgqlPreparedStatement) => {
          pstmt.setLong(1, 10000)
          const parallel: number = 0
          const dynamicSampling: number = 2
          const options: string = 'AUTO_COMMIT=F'
          const matchOptions: string = ''

          await pstmt.executeWithOptions(
            parallel,
            dynamicSampling,
            matchOptions,
            options,
          )
        },
      )

      // Query Data
      const pstmt: pgql.PgqlPreparedStatement = await pgqlConn.prepareStatement(`
        SELECT id(n) as nid, n.LONG_PROP
        FROM MATCH (n) ON test_graph
        WHERE n.LONG_PROP = ?
      `)

      await pgql.tryWith(pstmt, async (pstmt: pgql.PgqlPreparedStatement) => {
        pstmt.setLong(1, 10000)

        const rs: pgql.PgqlResultSet = await pstmt.executeQuery()
        await pgql.tryWith(rs, async (rs: pgql.PgqlResultSet) => {
          while (rs.next()) {
            console.log(`NID: ${rs.getLong('NID')}`)
            console.log(`LONG_PROP: ${rs.getLong('LONG_PROP')}`)
          }
        })
      })
    })
  } catch (err) {
    console.log(err)
  } finally {
    if (!conn.isClosed()) {
      conn.rollback()
      conn.closeSync()
    }
  }
}
