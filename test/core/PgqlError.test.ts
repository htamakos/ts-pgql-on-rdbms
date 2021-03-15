import { OracleConnection } from '../../src/core/Oracle'

import { PgqlConnection } from '../../src/core/PgqlConnection'
import { PgqlError } from '../../src/core/PgqlError'
import { PgqlPreparedStatement } from '../../src/core/PgqlPreparedStatement'

import { connManager } from '../TestHelper'

describe('PgqlError', (): void => {
  test('should handle PGQL Error', async (): Promise<void> => {
    // connection to Oracle Database
    const conn: OracleConnection = await connManager.getConnection()
    conn.setAutoCommit(false)

    try {
      // create PGQL Connection
      const pgqlConn: PgqlConnection = PgqlConnection.getConnection(conn)

      // oracle.pg.rdbms.pgql.PgqlToSqlException: Graph name is not set for this PgqlStatement.
      const pstmt: PgqlPreparedStatement = await pgqlConn.prepareStatement(`
        SELECT count(*) as CNT
        FROM MATCH (n)
        `)
      await expect(() => pstmt.executeQuery()).rejects.toThrowError(PgqlError)
    } finally {
      conn.closeSync()
    }
  })
})
