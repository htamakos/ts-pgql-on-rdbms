import {Pgql} from '../src/pgql'
import {IResult} from '../src/result'
import {ISession} from '../src/session'
import { createGraph, dropGraph, oracleDatabaseConfig } from './TestHelper'

const TEST_GRAPH_NAME: string = 'TEST_GRAPH_PGQL_DRIVER'

describe('Pgql', (): void => {
  beforeAll(() => createGraph(TEST_GRAPH_NAME))
  afterAll(() => dropGraph(TEST_GRAPH_NAME))

  test('should execute a SELECT PGQL', async (): Promise<void> => {
    const pgqlInstance: Pgql = Pgql.getInstance(oracleDatabaseConfig)
    const session: ISession = await pgqlInstance.getSession()
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

    const query: string = `
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
    `

    const result: IResult = await session.query(query)
    console.log(result.records[0].toDict())
  })
})
