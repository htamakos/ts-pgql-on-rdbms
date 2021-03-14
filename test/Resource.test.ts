import { connManager } from './TestHelper'
import { tryWith, tryWithSync } from '../src/Resource'
import { OracleConnection } from '../src/Oracle'

describe('tryWith', (): void => {
  test('should close AutoClosable resources', async (): Promise<void> => {
    const conn: OracleConnection = await connManager.getConnection()
    expect(conn.isClosed()).toBeFalsy()

    await tryWith(conn, async (conn: OracleConnection) => {
      conn.getAutoCommit()
    })
    expect(conn.isClosed()).toBeTruthy()
  })
})

describe('tryWithSync', (): void => {
  test('should close AutoClosable resources', async (): Promise<void> => {
    const conn: OracleConnection = await connManager.getConnection()
    expect(conn.isClosed()).toBeFalsy()

    tryWithSync(conn, (conn: OracleConnection) => {
      conn.getAutoCommit()
    })

    expect(conn.isClosed()).toBeTruthy()
  })
})
