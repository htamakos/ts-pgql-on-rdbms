import { LocalDateTime } from '../../src/core/JavaStandardType'
import { PgqlConnection } from '../../src/core/PgqlConnection'
import { PgqlPreparedStatement } from '../../src/core/PgqlPreparedStatement'
import { PgqlResultSet } from '../../src/core/PgqlResultSet'
import { tryWith } from '../../src/core/Resource'

import { createGraph, dropGraph, executeQueryTest } from '../TestHelper'

const TEST_GRAPH_NAME: string = 'TEST_GRAPH4'

describe('PgqlPreparedStatement', (): void => {
  beforeAll(async () => await createGraph(TEST_GRAPH_NAME))
  afterAll(async () => await dropGraph(TEST_GRAPH_NAME))

  test('should execute INSERT and SELECT PGQL PareparedStatement', async (): Promise<void> => {
    await executeQueryTest(async (pgqlConn: PgqlConnection) => {
      const labelValue: string = 'NEW_LABEL'
      const strPropValue: string = 'strValue'
      const intPropValue: number = 9999999
      const longPropValue: BigInt = BigInt(90)
      const floatPropValue: number = 10
      const doublePropValue: number = 0.001
      const booleanPropValue: boolean = false
      const timestampValue: LocalDateTime = LocalDateTime.now()

      const insertPstmt = await pgqlConn.prepareStatement(`
            INSERT INTO ${TEST_GRAPH_NAME}
              VERTEX v LABELS(${labelValue}) PROPERTIES (
                v.STR_PROP = ?,
                v.INT_PROP = CAST(? as integer),
                v.LONG_PROP = ?,
                v.FLOAT_PROP = ?,
                v.DOUBLE_PROP = ?,
                v.BOOLEAN_PROP = ?,
                v.TIMESTAMP_PROP = ? 
              )
        `)

      insertPstmt.setString(1, strPropValue)
      insertPstmt.setInt(2, intPropValue)
      insertPstmt.setLong(3, longPropValue)
      insertPstmt.setFloat(4, floatPropValue)
      insertPstmt.setDouble(5, doublePropValue)
      insertPstmt.setBoolean(6, booleanPropValue)
      insertPstmt.setTimestamp(7, timestampValue)

      await tryWith(insertPstmt, async (insertPstmt: PgqlPreparedStatement) => {
        await insertPstmt.executeWithOptions(0, 2, '', 'AUTO_COMMIT=F')
      })

      const checkStatement: PgqlPreparedStatement = await pgqlConn.prepareStatement(`
            SELECT
              id(n) as n_id,
              n.STR_PROP,
              n.INT_PROP,
              n.LONG_PROP as LONG_PROP,
              cast(n.FLOAT_PROP as float) as FLOAT_PROP,
              n.DOUBLE_PROP as DOUBLE_PROP,
              n.BOOLEAN_PROP,
              n.TIMESTAMP_PROP
            FROM MATCH (n:${labelValue}) ON ${TEST_GRAPH_NAME}
            WHERE n.STR_PROP = ?
            and n.INT_PROP = ?
            and n.LONG_PROP = ?
            and n.FLOAT_PROP = ?
            and n.DOUBLE_PROP = ?
            and n.BOOLEAN_PROP = ?
            and n.TIMESTAMP_PROP = ?
            LIMIT 1
      `)
      await tryWith(
        checkStatement,
        async (checkStatement: PgqlPreparedStatement) => {
          checkStatement.setString(1, strPropValue)
          checkStatement.setInt(2, intPropValue)
          checkStatement.setLong(3, longPropValue)
          checkStatement.setFloat(4, floatPropValue)
          checkStatement.setDouble(5, doublePropValue)
          checkStatement.setBoolean(6, booleanPropValue)
          checkStatement.setTimestamp(7, timestampValue)

          const rs: PgqlResultSet = await checkStatement.executeQuery()

          await tryWith(rs, async (rs: PgqlResultSet) => {
            let isFound = false

            while (rs.next()) {
              expect(rs.getString('STR_PROP')).toStrictEqual(strPropValue)
              expect(rs.getInteger('INT_PROP')).toBe(intPropValue)
              expect(rs.getLong('LONG_PROP')).toBe(longPropValue)
              expect(rs.getFloat('FLOAT_PROP')).toBe(floatPropValue)
              expect(rs.getDouble('DOUBLE_PROP')).toBe(doublePropValue)
              expect(rs.getBoolean('BOOLEAN_PROP')).toBe(booleanPropValue)
              expect(
                rs.getTimestamp('TIMESTAMP_PROP')!.toString(),
              ).toStrictEqual(timestampValue.toString())
              isFound = true
            }

            expect(isFound).toBeTruthy()
          })
        },
      )
      pgqlConn.getJdbcConnection().rollback()
    })
  })

  test('should execute UPDATE PGQL PareparedStatement', async (): Promise<void> => {
    await executeQueryTest(async (pgqlConn: PgqlConnection) => {
      const strPropValue: string = 'strValue'
      const intPropValue: number = 9999999
      const longPropValue: BigInt = BigInt('6269055155001303232')
      const floatPropValue: number = 10
      const doublePropValue: number = 0.001
      const booleanPropValue: boolean = false
      const timestampValue: LocalDateTime = LocalDateTime.now()

      const updatePstmt = await pgqlConn.prepareStatement(`
        UPDATE v SET (
            v.STR_PROP = ?,
            v.INT_PROP = CAST(? as integer),
            v.LONG_PROP = ?,
            v.FLOAT_PROP = ?,
            v.DOUBLE_PROP = ?,
            v.BOOLEAN_PROP = ?,
            v.TIMESTAMP_PROP = ?
          )
        FROM MATCH (v) ON ${TEST_GRAPH_NAME}
        LIMIT 1
      `)

      updatePstmt.setString(1, strPropValue)
      updatePstmt.setInt(2, intPropValue)
      updatePstmt.setLong(3, longPropValue)
      updatePstmt.setFloat(4, floatPropValue)
      updatePstmt.setDouble(5, doublePropValue)
      updatePstmt.setBoolean(6, booleanPropValue)
      updatePstmt.setTimestamp(7, timestampValue)

      await tryWith(updatePstmt, async (updatePstmt: PgqlPreparedStatement) => {
        await updatePstmt.executeWithOptions(0, 2, '', 'AUTO_COMMIT=F')
      })

      const checkStatement: PgqlPreparedStatement = await pgqlConn.prepareStatement(`
            SELECT
              id(n) as n_id,
              n.STR_PROP,
              n.INT_PROP,
              n.LONG_PROP as LONG_PROP,
              cast(n.FLOAT_PROP as float) as FLOAT_PROP,
              n.DOUBLE_PROP as DOUBLE_PROP,
              n.BOOLEAN_PROP,
              n.TIMESTAMP_PROP
            FROM MATCH (n) ON ${TEST_GRAPH_NAME}
            WHERE n.LONG_PROP = ?
            LIMIT 1
      `)
      await tryWith(
        checkStatement,
        async (checkStatement: PgqlPreparedStatement) => {
          checkStatement.setLong(1, longPropValue)
          const rs: PgqlResultSet = await checkStatement.executeQuery()

          await tryWith(rs, async (rs: PgqlResultSet) => {
            let isFound = false

            while (rs.next()) {
              expect(rs.getString('STR_PROP')).toStrictEqual(strPropValue)
              expect(rs.getInteger('INT_PROP')).toBe(intPropValue)
              expect(rs.getLong('LONG_PROP')).toBe(longPropValue)
              expect(rs.getFloat('FLOAT_PROP')).toBe(floatPropValue)
              expect(rs.getDouble('DOUBLE_PROP')).toBe(doublePropValue)
              expect(rs.getBoolean('BOOLEAN_PROP')).toBe(booleanPropValue)
              expect(
                rs.getTimestamp('TIMESTAMP_PROP')!.toString(),
              ).toStrictEqual(timestampValue.toString())
              isFound = true
            }

            expect(isFound).toBeTruthy()
          })
        },
      )
      pgqlConn.getJdbcConnection().rollback()
    })
  })
})
