import { PgqlConnection } from '../../src/core/PgqlConnection'
import { PgqlPreparedStatement } from '../../src/core/PgqlPreparedStatement'
import { createGraph, dropGraph, executeQueryTest } from '../TestHelper'

describe('LongValue', (): void => {
  const TEST_GRAPH_NAME = 'LONG_VALUE_TEST'
  beforeAll(async () => await createGraph(TEST_GRAPH_NAME))
  afterAll(async () => await dropGraph(TEST_GRAPH_NAME))

  test('JavaLongValue is BigInt on TS', async (): Promise<void> => {
    await executeQueryTest(async (pgqlConn: PgqlConnection) => {
      const expectValue: BigInt = BigInt('6269055155001303232')

      const pstmt: PgqlPreparedStatement = await pgqlConn.prepareStatement(`
        SELECT
            ${expectValue.toString()} as LONG_VALUE
        FROM MATCH (n) ON ${TEST_GRAPH_NAME}
        LIMIT 1
      `)

      const rs = await pstmt.executeQuery()
      rs.next()
      expect(rs.getLong('LONG_VALUE')).toEqual(expectValue)
    })
  })
})
