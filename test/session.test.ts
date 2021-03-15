import { IParameters } from '../src/parameter'
import { Pgql } from '../src/pgql'
import { IRecord } from '../src/record'
import { IResult } from '../src/result'
import { ISession } from '../src/session'
import { createGraph, dropGraph, oracleDatabaseConfig } from './TestHelper'

const TEST_GRAPH_NAME: string = 'TEST_GRAPH_PGQL_SESSION4'

describe('Session', (): void => {
  const pgqlInstance: Pgql = Pgql.getInstance(oracleDatabaseConfig)

  beforeAll(async () => await createGraph(TEST_GRAPH_NAME))
  afterAll(async () => await dropGraph(TEST_GRAPH_NAME))

  test('should execute SELECT and INSERT with parameters', async (): Promise<void> => {
    const session: ISession = await pgqlInstance.getSession()

    try {
      const labelValue: string = 'NEW_LABEL'
      const strPropValue: string = 'strValue'
      const strPropName: string = 'STR_PROP'
      const intPropValue: number = 9999999
      const intPropName: string = 'INT_PROP'
      const longPropValue: number = 90
      const longPropName: string = 'LONG_PROP'
      const floatPropValue: number = 10
      const floatPropName: string = 'FLOAT_PROP'
      const doublePropValue: number = 0.001
      const doublePropName: string = 'DOUBLE_PROP'
      const booleanPropValue: boolean = false
      const booleanPropName: string = 'BOOLEAN_PROP'
      const timestampPropName: string = 'TIMESTAMP_PROP'
      const timestampStringValue: string = '2018-12-15 10:10:00+00:00'
      const timestampPropValue: Date = new Date(timestampStringValue)

      const insertPgql: string = `
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
      `

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
          value: timestampPropValue,
          type: 'timestamp',
        },
      ]

      await session.modify(insertPgql, parameters)

      const checkStatement: string = `
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
      `

      const result: IResult = await session.query(checkStatement, parameters)
      expect(result.records.length).toBe(1)

      const record: IRecord = result.records[0]
      expect(record.get(intPropName)).toBe(intPropValue)
      expect(record.get(longPropName)).toBe(longPropValue)
      expect(record.get(doublePropName)).toBe(doublePropValue)
      expect(record.get(floatPropName)).toBe(floatPropValue)
      expect(record.get(strPropName)).toStrictEqual(strPropValue)
      expect(record.get(booleanPropName)).toBe(booleanPropValue)
      expect(record.get(timestampPropName)).toStrictEqual(timestampPropValue)
    } finally {
      session.rollback()
      session.closeSync()
    }
  })

  test('should execute UPDATE and DELETE PGQL', async (): Promise<void> => {
    const session: ISession = await pgqlInstance.getSession()

    try {
      const labelValue: string = 'NEW_LABEL'
      const strPropValue: string = 'strValue'
      const strPropName: string = 'STR_PROP'
      const intPropValue: number = 98989
      const intPropName: string = 'INT_PROP'
      const longPropValue: number = 1900000
      const longPropName: string = 'LONG_PROP'
      const floatPropValue: number = 180
      const floatPropName: string = 'FLOAT_PROP'
      const doublePropValue: number = 0.23
      const doublePropName: string = 'DOUBLE_PROP'
      const booleanPropValue: boolean = true
      const booleanPropName: string = 'BOOLEAN_PROP'
      const timestampPropName: string = 'TIMESTAMP_PROP'
      const timestampStringValue: string = '2018-12-18 10:10:00+00:00'
      const timestampPropValue: Date = new Date(timestampStringValue)

      const updatePgql: string = `
      UPDATE v SET (
          v.STR_PROP = ?,
          v.INT_PROP = CAST(? as integer),
          v.LONG_PROP = ?,
          v.FLOAT_PROP = ?,
          v.DOUBLE_PROP = ?,
          v.BOOLEAN_PROP = ?,
          v.TIMESTAMP_PROP = ?
        )
      FROM MATCH (v:VL2) ON ${TEST_GRAPH_NAME}
      `

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
          value: timestampPropValue,
          type: 'timestamp',
        },
      ]
      await session.modify(updatePgql, parameters)

      const checkStatement: string = `
      SELECT
        id(n) as n_id,
        n.STR_PROP,
        n.INT_PROP,
        n.LONG_PROP as LONG_PROP,
        cast(n.FLOAT_PROP as float) as FLOAT_PROP,
        n.DOUBLE_PROP,
        n.BOOLEAN_PROP,
        n.TIMESTAMP_PROP
      FROM MATCH (n:VL2) ON ${TEST_GRAPH_NAME}
      LIMIT 1
      `
      const result: IResult = await session.query(checkStatement)
      expect(result.records.length).toBe(1)

      const record: IRecord = result.records[0]
      expect(record.get(intPropName)).toBe(intPropValue)
      expect(record.get(longPropName)).toBe(longPropValue)
      expect(record.get(doublePropName)).toBe(doublePropValue)
      expect(record.get(floatPropName)).toBe(floatPropValue)
      expect(record.get(strPropName)).toStrictEqual(strPropValue)
      expect(record.get(booleanPropName)).toBe(booleanPropValue)
      expect(record.get(timestampPropName)).toStrictEqual(timestampPropValue)

      const deletePgql: string = `
        DELETE v FROM MATCH (v) ON ${TEST_GRAPH_NAME}
        WHERE
          v.STR_PROP = ?
       and v.INT_PROP = CAST(? as integer)
       and v.LONG_PROP = ?
       and v.FLOAT_PROP = ?
       and v.DOUBLE_PROP = ?
       and v.BOOLEAN_PROP = ?
       and v.TIMESTAMP_PROP = ?
       LIMIT 1
      `
      await session.modify(deletePgql, parameters)

      const checkCntPgql: string = `
        SELECT count(*) as cnt
        FROM MATCH (n:${labelValue}) ON ${TEST_GRAPH_NAME}
        WHERE n.STR_PROP = ?
        and n.INT_PROP = ?
        and n.LONG_PROP = ?
        and n.FLOAT_PROP = ?
        and n.DOUBLE_PROP = ?
        and n.BOOLEAN_PROP = ?
        and n.TIMESTAMP_PROP = ?
        LIMIT 1
      `

      const cntResult: IResult = await session.query(checkCntPgql, parameters)
      expect(cntResult.records[0].get('CNT')).toBe(0)
    } finally {
      session.rollback()
      session.closeSync()
    }
  })
})
