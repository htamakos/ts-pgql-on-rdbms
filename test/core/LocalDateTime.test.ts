import { LocalDateTime } from '../../src/core/JavaStandardType'

describe('LocalDateTime', (): void => {
  test('should get now', async () => {
    const ldt: LocalDateTime = LocalDateTime.now()
    expect(ldt != null).toBeTruthy()
  })

  test('should parse ISOString', async () => {
    const ldt: LocalDateTime = LocalDateTime.parseISOString(
      new Date().toISOString(),
    )
    expect(ldt != null).toBeTruthy()
  })

  test('should parse with format', async () => {
    const timestampStringValue: string = '2018-12-15 10:10:00+00:00'

    const ldt: LocalDateTime = LocalDateTime.parseWithFormat(
      timestampStringValue,
      'yyyy-MM-dd HH:mm:ss+00:00',
    )

    expect(ldt != null).toBeTruthy()
  })
})
