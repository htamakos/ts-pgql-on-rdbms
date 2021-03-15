import { PgqlConnection } from '../src/core/PgqlConnection'
import { PgqlPreparedStatement } from '../src/core/PgqlPreparedStatement'
import { PgqlResultSet } from '../src/core/PgqlResultSet'
import { tryWith } from '../src/core/Resource'
import { IRecord } from '../src/record'
import { IResult } from '../src/result'
import { IResultHanlder, ResultHanlder } from '../src/result-handler'
import { createGraph, dropGraph, executeQueryTest } from './TestHelper'

const TEST_GRAPH_NAME: string = 'TEST_GRAPH_RESULT_HANDLER'

describe('ResultHandler', (): void => {
  const resultHandler: IResultHanlder = new ResultHanlder()

  beforeAll(async () => await createGraph(TEST_GRAPH_NAME))
  afterAll(async () => await dropGraph(TEST_GRAPH_NAME))

  test('should handle ResultSet', async (): Promise<void> => {
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
        const result: IResult = await resultHandler.handle(rs)

        const record: IRecord = result.records[0]
        expect(record.get(intPropName)).toBe(intPropValue)
        expect(record.get(longPropName)).toBe(longPropValue)
        expect(record.get(doublePropName)).toBe(doublePropValue)
        expect(record.get(floatPropName)).toBe(floatPropValue)
        expect(record.get(stringPropName)).toStrictEqual(stringPropValue)
        expect(record.get(booleanPropName)).toBe(booleanPropValue)
        expect(record.get(timestampPropName)).toStrictEqual(timestampPropValue)
      })
    })
  })
})