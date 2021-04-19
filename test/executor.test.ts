import { LocalDateTime } from '../src/core/JavaStandardType'
import { OracleConnection } from '../src/core/Oracle'
import { PgqlConnection } from '../src/core/PgqlConnection'
import { ReuseExecutor, SimpleExecutor } from '../src/executor'
import { IParameters } from '../src/parameter'
import { IParameterHandler, ParameterHandler } from '../src/parameter-handler'
import { IResultHanlder, ResultHanlder } from '../src/result-handler'
import { connManager, createGraph, dropGraph } from './TestHelper'

const TEST_GRAPH_NAME: string = 'TEST_GRAPH_EXECUTOR'

describe('Executor', (): void => {
  beforeAll(async () => await createGraph(TEST_GRAPH_NAME))
  afterAll(async () => await dropGraph(TEST_GRAPH_NAME))

  test('SimpleExecutor should work with MODIFY PGQL', async (): Promise<void> => {
    const conn: OracleConnection = await connManager.getConnection()
    conn.setAutoCommit(false)

    const pgqlConn: PgqlConnection = PgqlConnection.getConnection(conn)
    try {
      const simpleExecutor: SimpleExecutor = new SimpleExecutor(pgqlConn)
      const parameterHandler: IParameterHandler = new ParameterHandler()

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
      const timestampPropValue: LocalDateTime = LocalDateTime.parseWithFormat(
        timestampStringValue,
        'yyyy-MM-dd HH:mm:ss+00:00',
      )
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

      const parameters1: IParameters = [
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

      await simpleExecutor.modify(insertPgql, parameterHandler, parameters1)

      const parameters2: IParameters = [
        { name: strPropName, index: 1, value: 'hagegege', type: 'string' },
        { name: intPropName, index: 2, value: 2010, type: 'int' },
        { name: longPropName, index: 3, value: 201022, type: 'long' },
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
      await simpleExecutor.modify(insertPgql, parameterHandler, parameters2)
      expect(simpleExecutor.getCacheSize()).toBe(0)
    } finally {
      conn.rollback()
      conn.closeSync()
    }
  })

  test('SimpleExecutor should work with QUERY PGQL', async (): Promise<void> => {
    const conn: OracleConnection = await connManager.getConnection()
    conn.setAutoCommit(false)

    try {
      const pgqlConn: PgqlConnection = PgqlConnection.getConnection(conn)

      const simpleExecutor: SimpleExecutor = new SimpleExecutor(pgqlConn)
      const parameterHandler: IParameterHandler = new ParameterHandler()
      const resultHandler: IResultHanlder = new ResultHanlder()

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
      FROM MATCH (n) ON ${TEST_GRAPH_NAME}
      WHERE n.STR_PROP != ?
      LIMIT 1
      `

      const parameters1: IParameters = [
        { name: 'STR_PROP', index: 1, value: '00000000', type: 'string' },
      ]

      await simpleExecutor.query(
        checkStatement,
        parameterHandler,
        resultHandler,
        parameters1,
      )

      const parameters2: IParameters = [
        { name: 'STR_PROP', index: 1, value: 'ho111111', type: 'string' },
      ]

      await simpleExecutor.query(
        checkStatement,
        parameterHandler,
        resultHandler,
        parameters2,
      )

      const parameters3: IParameters = [
        { name: 'STR_PROP', index: 1, value: 'xxxxxxxxx', type: 'string' },
      ]

      await simpleExecutor.query(
        checkStatement,
        parameterHandler,
        resultHandler,
        parameters3,
      )

      expect(simpleExecutor.getCacheSize()).toBe(0)
    } finally {
      conn.rollback()
      conn.closeSync()
    }
  })

  test('ReuseExecutor should work with MODIFY PGQL', async (): Promise<void> => {
    const conn: OracleConnection = await connManager.getConnection()
    conn.setAutoCommit(false)

    try {
      const pgqlConn: PgqlConnection = PgqlConnection.getConnection(conn)

      const reuseExecutor: ReuseExecutor = new ReuseExecutor(pgqlConn)
      const parameterHandler: IParameterHandler = new ParameterHandler()

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
      const timestampPropValue: LocalDateTime = LocalDateTime.parseWithFormat(
        timestampStringValue,
        'yyyy-MM-dd HH:mm:ss+00:00',
      )

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

      await reuseExecutor.modify(insertPgql, parameterHandler, parameters)
      await reuseExecutor.modify(insertPgql, parameterHandler, parameters)
      await reuseExecutor.modify(insertPgql, parameterHandler, parameters)

      expect(reuseExecutor.getCacheSize()).toBe(1)
    } finally {
      conn.rollback()
      conn.closeSync()
    }
  })

  test('ReuseExecutor should work with QUERY PGQL', async (): Promise<void> => {
    const conn: OracleConnection = await connManager.getConnection()
    conn.setAutoCommit(false)

    try {
      const pgqlConn: PgqlConnection = PgqlConnection.getConnection(conn)

      const reuseExecutor: ReuseExecutor = new ReuseExecutor(pgqlConn)
      const parameterHandler: IParameterHandler = new ParameterHandler()
      const resultHandler: IResultHanlder = new ResultHanlder()

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
      FROM MATCH (n) ON ${TEST_GRAPH_NAME}
      WHERE n.STR_PROP != ?
      LIMIT 1
      `

      const parameters1: IParameters = [
        { name: 'STR_PROP', index: 1, value: 'xxxxxxxxxx', type: 'string' },
      ]

      await reuseExecutor.query(
        checkStatement,
        parameterHandler,
        resultHandler,
        parameters1,
      )

      const parameters2: IParameters = [
        { name: 'STR_PROP', index: 1, value: '000000000', type: 'string' },
      ]

      await reuseExecutor.query(
        checkStatement,
        parameterHandler,
        resultHandler,
        parameters2,
      )

      const parameters3: IParameters = [
        { name: 'STR_PROP', index: 1, value: '11111111', type: 'string' },
      ]

      await reuseExecutor.query(
        checkStatement,
        parameterHandler,
        resultHandler,
        parameters3,
      )

      expect(reuseExecutor.getCacheSize()).toBe(1)
    } finally {
      conn.rollback()
      conn.closeSync()
    }
  })

  test('Executor with QueryOptions', async (): Promise<void> => {
    const conn: OracleConnection = await connManager.getConnection()
    conn.setAutoCommit(false)

    try {
      const pgqlConn: PgqlConnection = PgqlConnection.getConnection(conn)

      const reuseExecutor: ReuseExecutor = new ReuseExecutor(pgqlConn)
      const parameterHandler: IParameterHandler = new ParameterHandler()
      const resultHandler: IResultHanlder = new ResultHanlder()

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
      FROM MATCH (n) ON ${TEST_GRAPH_NAME}
      WHERE n.STR_PROP != ?
      LIMIT 1
      `

      const parameters1: IParameters = [
        { name: 'STR_PROP', index: 1, value: 'xxxxxxxxxx', type: 'string' },
      ]

      await reuseExecutor.query(
        checkStatement,
        parameterHandler,
        resultHandler,
        parameters1,
        {
          parallel: 0,
          dynamicSampling: 2,
          timeout: 1000,
          maxResults: -1,
          queryOptionString: 'USE_GT_TAB=F USE_VD_TAB=F',
        },
      )

      const parameters2: IParameters = [
        { name: 'STR_PROP', index: 1, value: '000000000', type: 'string' },
      ]

      await reuseExecutor.query(
        checkStatement,
        parameterHandler,
        resultHandler,
        parameters2,
      )

      const parameters3: IParameters = [
        { name: 'STR_PROP', index: 1, value: '11111111', type: 'string' },
      ]

      await reuseExecutor.query(
        checkStatement,
        parameterHandler,
        resultHandler,
        parameters3,
      )

      expect(reuseExecutor.getCacheSize()).toBe(1)
    } finally {
      conn.rollback()
      conn.closeSync()
    }
  })
})
