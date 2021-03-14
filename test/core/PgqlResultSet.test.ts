import { PgDatatypeConstants } from '../../src/core/PgDatatypeConstants'

import { PgqlConnection } from '../../src/core/PgqlConnection'
import { PgqlPreparedStatement } from '../../src/core/PgqlPreparedStatement'
import { PgqlResultSet } from '../../src/core/PgqlResultSet'
import { tryWith } from '../../src/core/Resource'

import { createGraph, dropGraph, executeQueryTest } from '../TestHelper'

const TEST_GRAPH_NAME: string = 'TEST_GRAPH2'

describe('PgqlResultSet', (): void => {
  beforeAll(() => createGraph(TEST_GRAPH_NAME))
  afterAll(() => dropGraph(TEST_GRAPH_NAME))

  test('should get column values', async (): Promise<void> => {
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
      const timestampPropValue: Date = new Date(timestampStringValue)

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
          while (rs.next()) {
            expect(rs.getInteger(intPropName)).toBe(intPropValue)
            expect(rs.getLong(longPropName)).toBe(longPropValue)
            expect(rs.getDouble(doublePropName)).toBe(doublePropValue)
            expect(rs.getFloat(floatPropName)).toBe(floatPropValue)
            expect(rs.getString(stringPropName)).toStrictEqual(stringPropValue)
            expect(rs.getBoolean(booleanPropName)).toBe(booleanPropValue)
            expect(rs.getTimestamp(timestampPropName)).toStrictEqual(
              timestampPropValue,
            )
          }
        })
      })
    })
  })

  test('should get null column values with cast', async (): Promise<void> => {
    await executeQueryTest(async (pgqlConn: PgqlConnection) => {
      // create sample SELECT PGQL PreparedStatement
      const intPropName: string = 'INT_VALUE'
      const longPropName: string = 'LONG_VALUE'
      const doublePropName: string = 'DOUBLE_VALUE'
      const floatPropName: string = 'FLOAT_VALUE'
      const stringPropName: string = 'STR_VALUE'
      const booleanPropName: string = 'BOOLEAN_VALUE'
      const timestampPropName: string = 'TIMESTAMP_VALUE'

      const pstmt: PgqlPreparedStatement = await pgqlConn.prepareStatement(`
        SELECT
            cast(n.UN_PROP as int) as ${intPropName},
            cast(n.UN_PROP as long) as ${longPropName},
            cast(n.UN_PROP as double) as ${doublePropName},
            cast(n.UN_PROP as float) as ${floatPropName},
            cast(n.UN_PROP as string) as ${stringPropName},
            cast(n.UN_PROP as boolean) as ${booleanPropName},
            cast(n.UN_PROP as timestamp) as ${timestampPropName}
        FROM MATCH (n) ON ${TEST_GRAPH_NAME}
        LIMIT 1
      `)

      // execute sample PreparedStatement
      await tryWith(pstmt, async (pstmt: PgqlPreparedStatement) => {
        const rs: PgqlResultSet = await pstmt.executeQuery()

        // get ResultSet
        await tryWith(rs, async (rs: PgqlResultSet) => {
          while (rs.next()) {
            expect(rs.getInteger(intPropName)).toBeNull()
            expect(rs.getLong(longPropName)).toBeNull()
            expect(rs.getDouble(doublePropName)).toBeNull()
            expect(rs.getFloat(floatPropName)).toBeNull()
            expect(rs.getString(stringPropName)).toBeNull()
            expect(rs.getBoolean(booleanPropName)).toBeNull()
            expect(rs.getTimestamp(timestampPropName)).toBeNull()
          }
        })
      })
    })
  })

  test('should get null column values without cast', async (): Promise<void> => {
    await executeQueryTest(async (pgqlConn: PgqlConnection) => {
      // create sample SELECT PGQL PreparedStatement
      const intPropName: string = 'INT_VALUE'
      const longPropName: string = 'LONG_VALUE'
      const doublePropName: string = 'DOUBLE_VALUE'
      const floatPropName: string = 'FLOAT_VALUE'
      const stringPropName: string = 'STR_VALUE'
      const booleanPropName: string = 'BOOLEAN_VALUE'
      const timestampPropName: string = 'TIMESTAMP_VALUE'

      const pstmt: PgqlPreparedStatement = await pgqlConn.prepareStatement(`
        SELECT
            n.UN_PROP as ${intPropName},
            n.UN_PROP as ${longPropName},
            n.UN_PROP as ${doublePropName},
            n.UN_PROP as ${floatPropName},
            n.UN_PROP as ${stringPropName},
            n.UN_PROP as ${booleanPropName},
            n.UN_PROP as ${timestampPropName}
        FROM MATCH (n) ON ${TEST_GRAPH_NAME}
        LIMIT 1
      `)

      // execute sample PreparedStatement
      await tryWith(pstmt, async (pstmt: PgqlPreparedStatement) => {
        const rs: PgqlResultSet = await pstmt.executeQuery()

        // get ResultSet
        await tryWith(rs, async (rs: PgqlResultSet) => {
          while (rs.next()) {
            expect(rs.getInteger(intPropName)).toBeNull()
            expect(rs.getLong(longPropName)).toBeNull()
            expect(rs.getDouble(doublePropName)).toBeNull()
            expect(rs.getFloat(floatPropName)).toBeNull()
            expect(rs.getString(stringPropName)).toBeNull()
            expect(rs.getBoolean(booleanPropName)).toBeNull()
            expect(rs.getTimestamp(timestampPropName)).toBeNull()
          }
        })
      })
    })
  })

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
          rs.next()

          const index_and_expect_types: Array<[number, number]> = [
            [1, PgDatatypeConstants.TYPE_DT_INTEGER],
            [2, PgDatatypeConstants.TYPE_DT_LONG],
            [3, PgDatatypeConstants.TYPE_DT_DOUBLE],
            [4, PgDatatypeConstants.TYPE_DT_FLOAT],
            [5, PgDatatypeConstants.TYPE_DT_STRING],
            [6, PgDatatypeConstants.TYPE_DT_BOOL],
            [7, PgDatatypeConstants.TYPE_DT_DATE],
          ]

          index_and_expect_types.forEach((t) => {
            expect(rs.getValueType(t[0])).toBe(t[1])
          })
        })
      })
    })
  })
})
