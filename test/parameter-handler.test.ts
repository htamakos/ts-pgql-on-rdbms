import { LocalDateTime } from '../src/core/JavaStandardType'
import { OracleConnection } from '../src/core/Oracle'
import { PgqlConnection } from '../src/core/PgqlConnection'
import { PgqlPreparedStatement } from '../src/core/PgqlPreparedStatement'
import { PgqlResultSet } from '../src/core/PgqlResultSet'
import { tryWith } from '../src/core/Resource'
import { IParameters } from '../src/parameter'
import { IParameterHandler, ParameterHandler } from '../src/parameter-handler'
import { createGraph, dropGraph, executeQueryTest } from './TestHelper'

const TEST_GRAPH_NAME: string = 'TEST_GRAPH_PARAMETER_HANDLER'

describe('ParameterHandler', (): void => {
  const parameterHandler: IParameterHandler = new ParameterHandler()

  beforeAll(async () => await createGraph(TEST_GRAPH_NAME))
  afterAll(async () => {
    executeQueryTest(async (pgqlConn: PgqlConnection) => {
      const conn: OracleConnection = pgqlConn.getJdbcConnection()
      if (!conn.isClosed()) {
        conn.rollback()
      }
    })

    await dropGraph(TEST_GRAPH_NAME)
  })

  test('should handle parameters', async (): Promise<void> => {
    await executeQueryTest(async (pgqlConn: PgqlConnection) => {
      const labelValue: string = 'NEW_LABEL'
      const strPropValue: string = 'strValue'
      const strPropName: string = 'STR_PROP'
      const intPropValue: number = 9999999
      const intPropName: string = 'INT_PROP'
      const longPropValue: BigInt = BigInt(90)
      const longPropName: string = 'LONG_PROP'
      const floatPropValue: number = 10
      const floatPropName: string = 'FLOAT_PROP'
      const doublePropValue: number = 0.001
      const doublePropName: string = 'DOUBLE_PROP'
      const booleanPropValue: boolean = false
      const booleanPropName: string = 'BOOLEAN_PROP'
      const timestampValue: LocalDateTime = LocalDateTime.now()
      const timestampPropName: string = 'TIMESTAMP_PROP'

      const insertPstmt = await pgqlConn.prepareStatement(`
      INSERT INTO ${TEST_GRAPH_NAME}
        VERTEX v LABELS(${labelValue}) PROPERTIES (
          v.${strPropName} = ?,
          v.${intPropName} = CAST(? as integer),
          v.${longPropName} = ?,
          v.${floatPropName} = ?,
          v.${doublePropName} = ?,
          v.${booleanPropName} = ?,
          v.${timestampPropName} = ?
        )
      `)

      const parameters: IParameters = [
        { name: strPropName, index: 1, value: strPropValue, type: 'string' },
        { name: intPropName, index: 2, value: intPropValue, type: 'int' },
        { name: longPropName, index: 3, value: longPropValue, type: 'long' },
        { name: floatPropName, index: 4, value: floatPropValue, type: 'float' },
        {
          name: doublePropName,
          index: 5,
          value: doublePropValue,
          type: 'double',
        },
        {
          name: booleanPropName,
          index: 6,
          value: booleanPropValue,
          type: 'boolean',
        },
        {
          name: timestampPropName,
          index: 7,
          value: timestampValue,
          type: 'timestamp',
        },
      ]
      parameterHandler.setParameters(insertPstmt, parameters)

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
          parameterHandler.setParameters(checkStatement, parameters)
          const rs: PgqlResultSet = await checkStatement.executeQuery()

          await tryWith(rs, async (rs: PgqlResultSet) => {
            let isFound = false

            while (rs.next()) {
              expect(rs.getString(strPropName)).toStrictEqual(strPropValue)
              expect(rs.getInteger(intPropName)).toBe(intPropValue)
              expect(rs.getLong(longPropName)).toBe(longPropValue)
              expect(rs.getFloat(floatPropName)).toBe(floatPropValue)
              expect(rs.getDouble(doublePropName)).toBe(doublePropValue)
              expect(rs.getBoolean(booleanPropName)).toBe(booleanPropValue)
              expect(
                rs.getTimestamp(timestampPropName)!.toString(),
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

  test('should handle parameters without types', async (): Promise<void> => {
    await executeQueryTest(async (pgqlConn: PgqlConnection) => {
      const labelValue: string = 'NEW_LABEL_NO_TYPES'
      const strPropValue: string = 'strValueNT'
      const strPropName: string = 'STR_PROP'
      const intPropValue: number = 88881
      const intPropName: string = 'INT_PROP'
      const longPropValue: BigInt = BigInt(68121190)
      const longPropName: string = 'LONG_PROP'
      const floatPropValue: number = 30
      const floatPropName: string = 'FLOAT_PROP'
      const doublePropValue: number = 0.481
      const doublePropName: string = 'DOUBLE_PROP'
      const booleanPropValue: boolean = true
      const booleanPropName: string = 'BOOLEAN_PROP'
      const timestampValue: LocalDateTime = LocalDateTime.now()
      const timestampPropName: string = 'TIMESTAMP_PROP'

      const insertPstmt = await pgqlConn.prepareStatement(`
      INSERT INTO ${TEST_GRAPH_NAME}
        VERTEX v LABELS(${labelValue}) PROPERTIES (
          v.${strPropName} = ?,
          v.${intPropName} = CAST(? as integer),
          v.${longPropName} = ?,
          v.${floatPropName} = ?,
          v.${doublePropName} = ?,
          v.${booleanPropName} = ?,
          v.${timestampPropName} = ?
        )
      `)

      const parameters: IParameters = [
        { name: strPropName, index: 1, value: strPropValue },
        { name: intPropName, index: 2, value: intPropValue },
        { name: longPropName, index: 3, value: longPropValue },
        {
          name: floatPropName,
          index: 4,
          value: floatPropValue,
        },
        {
          name: doublePropName,
          index: 5,
          value: doublePropValue,
        },
        {
          name: booleanPropName,
          index: 6,
          value: booleanPropValue,
        },
        {
          name: timestampPropName,
          index: 7,
          value: timestampValue,
        },
      ]
      parameterHandler.setParameters(insertPstmt, parameters)

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
          parameterHandler.setParameters(checkStatement, parameters)
          const rs: PgqlResultSet = await checkStatement.executeQuery()

          await tryWith(rs, async (rs: PgqlResultSet) => {
            let isFound = false

            while (rs.next()) {
              expect(rs.getString(strPropName)).toStrictEqual(strPropValue)
              expect(rs.getInteger(intPropName)).toBe(intPropValue)
              expect(rs.getLong(longPropName)).toBe(longPropValue)
              expect(rs.getFloat(floatPropName)).toBe(floatPropValue)
              expect(rs.getDouble(doublePropName)).toBe(doublePropValue)
              expect(rs.getBoolean(booleanPropName)).toBe(booleanPropValue)
              expect(
                rs.getTimestamp(timestampPropName)!.toString(),
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

  test('should handle parameters without types, index and names', async (): Promise<void> => {
    await executeQueryTest(async (pgqlConn: PgqlConnection) => {
      const labelValue: string = 'NEW_LABEL_ONLY_VALUE'
      const strPropValue: string = 'strValueNT'
      const strPropName: string = 'STR_PROP'
      const intPropValue: number = 88881
      const intPropName: string = 'INT_PROP'
      const longPropValue: BigInt = BigInt(68121190)
      const longPropName: string = 'LONG_PROP'
      const floatPropValue: number = 30
      const floatPropName: string = 'FLOAT_PROP'
      const doublePropValue: number = 0.481
      const doublePropName: string = 'DOUBLE_PROP'
      const booleanPropValue: boolean = true
      const booleanPropName: string = 'BOOLEAN_PROP'
      const timestampValue: LocalDateTime = LocalDateTime.now()
      const timestampPropName: string = 'TIMESTAMP_PROP'

      const insertPstmt = await pgqlConn.prepareStatement(`
      INSERT INTO ${TEST_GRAPH_NAME}
        VERTEX v LABELS(${labelValue}) PROPERTIES (
          v.${strPropName} = ?,
          v.${intPropName} = CAST(? as integer),
          v.${longPropName} = ?,
          v.${floatPropName} = ?,
          v.${doublePropName} = ?,
          v.${booleanPropName} = ?,
          v.${timestampPropName} = ?
        )
      `)

      const parameters: IParameters = [
        { value: strPropValue },
        { value: intPropValue },
        { value: longPropValue },
        { value: floatPropValue },
        { value: doublePropValue },
        { value: booleanPropValue },
        { value: timestampValue },
      ]
      parameterHandler.setParameters(insertPstmt, parameters)

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
          parameterHandler.setParameters(checkStatement, parameters)
          const rs: PgqlResultSet = await checkStatement.executeQuery()

          await tryWith(rs, async (rs: PgqlResultSet) => {
            let isFound = false

            while (rs.next()) {
              expect(rs.getString(strPropName)).toStrictEqual(strPropValue)
              expect(rs.getInteger(intPropName)).toBe(intPropValue)
              expect(rs.getLong(longPropName)).toBe(longPropValue)
              expect(rs.getFloat(floatPropName)).toBe(floatPropValue)
              expect(rs.getDouble(doublePropName)).toBe(doublePropValue)
              expect(rs.getBoolean(booleanPropName)).toBe(booleanPropValue)
              expect(
                rs.getTimestamp(timestampPropName)!.toString(),
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
