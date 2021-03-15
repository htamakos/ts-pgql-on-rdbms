import { IRecord, Record } from '../src/record'
import { PgqlType } from '../src/types'

describe('record', (): void => {
  let record: IRecord

  beforeAll(async () => {
    const columns: string[] = ['COL1', 'COL2']
    const fields: PgqlType[] = [1, 'hoge']

    record = new Record(columns, fields)
  })

  test('should generate columns', async () => {
    const columns: string[] = [...record.columns()]
    expect(columns[0]).toBe('COL1')
    expect(columns[1]).toBe('COL2')
  })

  test('should get field by column name', async () => {
    expect(record.get('COL1')).toBe(1)
    expect(record.get('COL2')).toBe('hoge')
    expect(record.get('UNKOWN_COL')).toBeUndefined()
  })

  test('should generate entries', async () => {
    const entries: [string, PgqlType][] = [...record.entries()]

    expect(entries[0][0]).toBe('COL1')
    expect(entries[0][1]).toBe(1)
    expect(entries[1][0]).toBe('COL2')
    expect(entries[1][1]).toBe('hoge')
  })

  test('should generate values', async () => {
    const values: PgqlType[] = [...record.values()]
    expect(values[0]).toBe(1)
    expect(values[1]).toBe('hoge')
  })
})
