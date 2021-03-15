import { PgqlConnection } from '../../src/core/PgqlConnection'
import { PgqlPreparedStatement } from '../../src/core/PgqlPreparedStatement'
import { PgqlResultSet } from '../../src/core/PgqlResultSet'
import { PgqlResultSetMetaDataImpl } from '../../src/core/PgqlResultSetMetaDataImpl'
import { tryWith } from '../../src/core/Resource'

import { createGraph, dropGraph, executeQueryTest } from '../TestHelper'
import * as utils from '../../src/utils'

const TEST_GRAPH_NAME: string = 'TEST_GRAPH_RESULT_SET_META'

describe('PgqlResultSetMetaDataImpl', (): void => {
  beforeAll(async () => await createGraph(TEST_GRAPH_NAME))
  afterAll(async () => await dropGraph(TEST_GRAPH_NAME))

  test('should get ResultSet metadata', async (): Promise<void> => {
    await executeQueryTest(async (pgqlConn: PgqlConnection) => {
      // create sample SELECT PGQL PreparedStatement
      const intPropName: string = 'INT_VALUE'
      const intPropValue: number = 1
      const longPropName: string = 'LONG_VALUE'
      const longPropValue: number = 2
      const doublePropName: string = 'DOUBLE_VALUE'
      const doublePropValue: number = 0.1
      const floatPropName: string = 'FLOAT_VALUE'
      const floatPropValue: number = 10
      const stringPropName: string = 'STR_VALUE'
      const stringPropValue: string = 'HOGEHOGE'
      const booleanPropName: string = 'BOOLEAN_VALUE'
      const booleanPropValue: boolean = true
      const timestampPropName: string = 'TIMESTAMP_VALUE'
      const timestampStringValue: string = '2018-12-15 10:10:00+00:00'

      const pstmt: PgqlPreparedStatement = await pgqlConn.prepareStatement(`
        SELECT
            cast(${intPropValue} as int) as ${intPropName},
            cast(${longPropValue} as long) as ${longPropName},
            ${doublePropValue} as ${doublePropName},
            cast(${floatPropValue} as float) as ${floatPropName},
            '${stringPropValue}' as ${stringPropName},
            ${booleanPropValue} as ${booleanPropName},
            timestamp '${timestampStringValue}' as ${timestampPropName}
        FROM MATCH (n) ON ${TEST_GRAPH_NAME}
        LIMIT 1
      `)

      // execute sample PreparedStatement
      await tryWith(pstmt, async (pstmt: PgqlPreparedStatement) => {
        const rs: PgqlResultSet = await pstmt.executeQuery()

        // get ResultSet
        await tryWith(rs, async (rs: PgqlResultSet) => {
          const meta: PgqlResultSetMetaDataImpl = rs.getMetaData()

          expect(meta.getColumnCount()).toBe(7)
          const columnNames: string[] = [
            ...utils.range(0, meta.getColumnCount()),
          ].map((i) => meta.getColumnName(i))
          const expectColumnNames: string[] = [
            intPropName,
            longPropName,
            doublePropName,
            floatPropName,
            stringPropName,
            booleanPropName,
            timestampPropName,
          ]

          for (let i of [...utils.range(0, meta.getColumnCount())]) {
            expect(columnNames[i]).toBe(expectColumnNames[i])
          }
        })
      })
    })
  })
})
