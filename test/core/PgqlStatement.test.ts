import { LocalDateTime } from '../../src/core/JavaStandardType'
import { PgqlConnection } from '../../src/core/PgqlConnection'
import { PgqlResultSet } from '../../src/core/PgqlResultSet'
import { PgqlStatement } from '../../src/core/PgqlStatement'
import { tryWith } from '../../src/core/Resource'

import { createGraph, dropGraph, executeQueryTest } from '../TestHelper'

const TEST_GRAPH_NAME: string = 'TEST_GRAPH_PGQL_STATEMENT'

describe('PgqlStatement', (): void => {
  beforeAll(async () => await createGraph(TEST_GRAPH_NAME))
  afterAll(async () => await dropGraph(TEST_GRAPH_NAME))

  test('should execute INSERT and SELECT PGQL Statement', async (): Promise<void> => {
    await executeQueryTest(async (pgqlConn: PgqlConnection) => {
      const labelValue: string = 'NEW_LABEL'
      const strPropValue: string = 'strValue'
      const intPropValue: number = 9999999
      const longPropValue: BigInt = BigInt(90)
      const floatPropValue: number = 10
      const doublePropValue: number = 0.001
      const booleanPropValue: boolean = false
      const timestampValueStr: string = '2018-01-15 16:30:00+00:00'
      const timestampValue: LocalDateTime = LocalDateTime.parseWithFormat(
        timestampValueStr,
        'yyyy-MM-dd HH:mm:ss+00:00',
      )

      const insertPgql: string = `
            INSERT INTO ${TEST_GRAPH_NAME}
              VERTEX v LABELS(${labelValue}) PROPERTIES (
                v.STR_PROP = '${strPropValue}',
                v.INT_PROP = CAST(${intPropValue} as integer),
                v.LONG_PROP = ${longPropValue.toString()},
                v.FLOAT_PROP = ${floatPropValue},
                v.DOUBLE_PROP = ${doublePropValue},
                v.BOOLEAN_PROP = ${booleanPropValue},
                v.TIMESTAMP_PROP = timestamp '${timestampValueStr}'
              )
        `
      const insertStmt: PgqlStatement = await pgqlConn.createStatement()

      await tryWith(insertStmt, async (insertStmt: PgqlStatement) => {
        await insertStmt.executeWithOptions(
          insertPgql,
          0,
          2,
          '',
          'AUTO_COMMIT=F',
        )
        pgqlConn.getJdbcConnection().commit()
      })

      const checkQuery: string = `
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
            LIMIT 1
      `

      const checkStatement: PgqlStatement = await pgqlConn.createStatement()
      await tryWith(checkStatement, async (checkStatement: PgqlStatement) => {
        const rs: PgqlResultSet = await checkStatement.executeQuery(checkQuery)

        await tryWith(rs, async (rs: PgqlResultSet) => {
          let isFound = false

          while (rs.next()) {
            expect(rs.getString('STR_PROP')).toStrictEqual(strPropValue)
            expect(rs.getInteger('INT_PROP')).toBe(intPropValue)
            expect(rs.getLong('LONG_PROP')).toBe(longPropValue)
            expect(rs.getFloat('FLOAT_PROP')).toBe(floatPropValue)
            expect(rs.getDouble('DOUBLE_PROP')).toBe(doublePropValue)
            expect(rs.getBoolean('BOOLEAN_PROP')).toBe(booleanPropValue)
            expect(rs.getTimestamp('TIMESTAMP_PROP')!.toString()).toStrictEqual(
              timestampValue.toString(),
            )
            isFound = true
          }

          expect(isFound).toBeTruthy()
        })
      })
    })
  })

  test('should execute UPDATE PGQL Statement', async (): Promise<void> => {
    await executeQueryTest(async (pgqlConn: PgqlConnection) => {
      const strPropValue: string = 'strValue'
      const intPropValue: number = 9999999
      const longPropValue: BigInt = BigInt(3987654321)
      const floatPropValue: number = 10
      const doublePropValue: number = 0.001
      const booleanPropValue: boolean = false
      const timestampValueStr: string = '2018-01-15 16:30:00+00:00'
      const timestampValue: LocalDateTime = LocalDateTime.parseWithFormat(
        timestampValueStr,
        'yyyy-MM-dd HH:mm:ss+00:00',
      )

      const updateStmt: PgqlStatement = await pgqlConn.createStatement()
      const updatePGQL: string = `
        UPDATE v SET (
            v.STR_PROP = '${strPropValue}',
            v.INT_PROP = CAST(${intPropValue} as integer),
            v.LONG_PROP = ${longPropValue.toString()},
            v.FLOAT_PROP = ${floatPropValue},
            v.DOUBLE_PROP = ${doublePropValue},
            v.BOOLEAN_PROP = ${booleanPropValue},
            v.TIMESTAMP_PROP = timestamp '${timestampValueStr}'
          )
        FROM MATCH (v) ON ${TEST_GRAPH_NAME}
        LIMIT 1
      `

      await tryWith(updateStmt, async (updateStmt: PgqlStatement) => {
        await updateStmt.executeWithOptions(
          updatePGQL,
          0,
          2,
          '',
          'AUTO_COMMIT=F',
        )
      })

      const checkQuery: string = `
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
            WHERE n.LONG_PROP = ${longPropValue}
            LIMIT 1
      `

      const checkStatement: PgqlStatement = await pgqlConn.createStatement()
      await tryWith(checkStatement, async (checkStatement: PgqlStatement) => {
        const rs: PgqlResultSet = await checkStatement.executeQuery(checkQuery)

        await tryWith(rs, async (rs: PgqlResultSet) => {
          let isFound = false

          while (rs.next()) {
            expect(rs.getString('STR_PROP')).toStrictEqual(strPropValue)
            expect(rs.getInteger('INT_PROP')).toBe(intPropValue)
            expect(rs.getLong('LONG_PROP')).toBe(longPropValue)
            expect(rs.getFloat('FLOAT_PROP')).toBe(floatPropValue)
            expect(rs.getDouble('DOUBLE_PROP')).toBe(doublePropValue)
            expect(rs.getBoolean('BOOLEAN_PROP')).toBe(booleanPropValue)
            expect(rs.getTimestamp('TIMESTAMP_PROP')!.toString()).toStrictEqual(
              timestampValue.toString(),
            )
            isFound = true
          }

          expect(isFound).toBeTruthy()
        })
      })

      pgqlConn.getJdbcConnection().rollback()
    })
  })
})
