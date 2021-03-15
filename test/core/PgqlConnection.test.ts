import { OracleConnection } from '../../src/core/Oracle'

import { PgqlConnection } from '../../src/core/PgqlConnection'
import { PgqlPreparedStatement } from '../../src/core/PgqlPreparedStatement'
import { PgqlResultSet } from '../../src/core/PgqlResultSet'
import { tryWith } from '../../src/core/Resource'

import { connManager, createGraph, dropGraph } from '../TestHelper'

const TEST_GRAPH_NAME: string = 'TEST_GRAPH1'

describe('PgqlConnection', (): void => {
  beforeAll(async () => await createGraph(TEST_GRAPH_NAME))
  afterAll(async () => await dropGraph(TEST_GRAPH_NAME))

  test('should execute a SELECT PGQL', async (): Promise<void> => {
    // connection to Oracle Database
    const conn: OracleConnection = await connManager.getConnection()
    conn.setAutoCommit(false)

    await tryWith(conn, async (conn: OracleConnection) => {
      // create PGQL Connection
      const pgqlConn: PgqlConnection = PgqlConnection.getConnection(conn)

      // create sample SELECT PGQL PreparedStatement
      const pstmt: PgqlPreparedStatement = await pgqlConn.prepareStatement(`
        SELECT count(*) as CNT
        FROM MATCH (n) ON ${TEST_GRAPH_NAME}
      `)

      // execute sample PreparedStatement
      await tryWith(pstmt, async (pstmt: PgqlPreparedStatement) => {
        const rs: PgqlResultSet = await pstmt.executeQuery()

        // get ResultSet
        await tryWith(rs, async (rs: PgqlResultSet) => {
          expect(rs.next()).toBeTruthy()
        })
      })
    })
  })
})
